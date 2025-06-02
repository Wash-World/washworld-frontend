import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { useAppDispatch, useAppSelector } from '../../../store';
import { loginUser } from '../../../store/authSlice';

// When a user fills out the login form and taps "Log In", the LoginScreen correctly:
// Dispatches a Redux action (loginUser) with the email and password.
// Sends that action to the Redux dispatch

jest.mock('@expo/vector-icons', () => {
  const View = require('react-native').View;
  return {
    Ionicons: (props) => <View {...props} />,
  };
});


jest.mock('../../../store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../../store/authSlice', () => ({
  loginUser: jest.fn((payload) => ({ type: 'LOGIN', payload })),
}));

describe('LoginScreen', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useAppDispatch.mockReturnValue(dispatchMock);
    useAppSelector.mockReturnValue({ status: 'idle', error: null });
    dispatchMock.mockClear();
  });

  it('dispatches loginUser with email and password', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={{ reset: jest.fn(), navigate: jest.fn() }} />
    );

    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.press(getByText('Log In'));

    expect(loginUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'LOGIN',
      payload: {
        email: 'user@example.com',
        password: 'password123',
      },
    });
  });
});
