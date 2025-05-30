// __tests__/LoginScreen.ui.test.js

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import LoginScreen from '../src/screens/auth/LoginScreen'
import { ROUTES } from '../src/constants/routes'

// 1. Shared, mutable mockAuthState for our selector to use
let mockAuthState = {
  status: 'idle',
  error: null,
  token: null,
  user: null,
}

// 2. Mock the store hooks once; use mockAuthState in our factory
const mockDispatch = jest.fn()
jest.mock('../src/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) =>
    selector({ auth: mockAuthState, signup: {} }),
}))

// 3. Mock saveToken so it doesn’t write to SecureStore
jest.mock('../src/hooks/secureStore', () => ({
  saveToken: jest.fn(),
}))

// 4. Fake navigation
const mockNavigate = jest.fn()
const navigation = { navigate: mockNavigate, reset: jest.fn() }

describe('LoginScreen UI states', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders error message when auth.error is set', () => {
    // ARRANGE
    mockAuthState = {
      status: 'failed',
      error: 'Bad creds',
      token: null,
      user: null,
    }

    // ACT
    const { getByText, queryByTestId } = render(
      <LoginScreen navigation={navigation} />
    )

    // ASSERT
    expect(getByText('Bad creds')).toBeTruthy()
    expect(queryByTestId('activity-indicator')).toBeNull()
  })

  it('shows spinner when status is loading', () => {
    // ARRANGE
    mockAuthState = {
      status: 'loading',
      error: null,
      token: null,
      user: null,
    }

    // ACT
    const { getByTestId, queryByTestId, queryByText } = render(
      <LoginScreen navigation={navigation} />
    )

    // ASSERT: spinner is present…
    expect(getByTestId('activity-indicator')).toBeTruthy()
    // …and the login *button* is gone
     expect(queryByTestId('login-button')).toBeNull()
  })

  it('navigates to signup on Register press', () => {
    // ARRANGE
    mockAuthState = {
      status: 'idle',
      error: null,
      token: null,
      user: null,
    }

    // ACT
    const { getByText } = render(<LoginScreen navigation={navigation} />)
    fireEvent.press(getByText('Register'))

    // ASSERT
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SIGNUP.STACK, {
      screen: ROUTES.SIGNUP.SELECT_PLAN,
    })
  })

  it('on success saves token and resets navigation', () => {
    // ARRANGE
    mockAuthState = {
      status: 'succeeded',
      error: null,
      token: 'xyz',
      user: { id: 5 },
    }
    const { saveToken } = require('../src/hooks/secureStore')

    // ACT
    render(<LoginScreen navigation={navigation} />)

    // ASSERT
    expect(saveToken).toHaveBeenCalledWith('xyz')
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: ROUTES.APP_TABS }],
    })
  })
})
