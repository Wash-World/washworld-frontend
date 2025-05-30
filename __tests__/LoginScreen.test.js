// __tests__/LoginScreen.test.js

// ARRANGE

// 1. React + testing utilities
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

// 2. Redux real store with thunk middleware
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

// 3. Screen under test and your auth thunks
import LoginScreen from '../src/screens/auth/LoginScreen'
import * as authThunks from '../src/store/authSlice'

// 4. Build a minimal reducer & store factory
const fakeReducer = (state = {}) => state
function makeStore(initialState) {
  return createStore(fakeReducer, initialState, applyMiddleware(thunk))
}

// 5. Mock navigation prop
const mockNavigate = jest.fn()
const navigation = { navigate: mockNavigate }

// 6. Set up a fresh store before each test
let store
beforeEach(() => {
  jest.clearAllMocks()
  // use our real-store factory instead of redux-mock-store
  store = makeStore({ auth: { user: null, token: null, status: 'idle', error: null } })
  // spy on dispatch so we can assert calls
  jest.spyOn(store, 'dispatch')
})

// ACT & ASSERT
it('dispatches loginUser thunk and navigates on success', async () => {
  // Mock the fetch response to return a token
  fetch.mockResponseOnce(
    JSON.stringify({ user: { id: 1 }, access_token: 'abc123' }),
    { status: 200 }
  )

  // Spy on your loginUser thunk to simulate dispatch behavior
  const loginSpy = jest
    .spyOn(authThunks, 'loginUser')
    .mockImplementation(creds => async dispatch => {
      dispatch({ type: 'auth/loginUser/pending' })
      dispatch({
        type: 'auth/loginUser/fulfilled',
        payload: { user: { id: 1 }, access_token: 'abc123' },
      })
    })

  // Render the LoginScreen within the Redux Provider
  const { getByPlaceholderText, getByText } = render(
    <Provider store={store}>
      <LoginScreen navigation={navigation} />
    </Provider>
  )

  // Enter credentials and press the login button
  fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com')
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123')
  fireEvent.press(getByText('Log In'))

  // Wait for the thunk to have been called with correct credentials
  await waitFor(() => {
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    })
  })

  // Verify that dispatch was called with pending & fulfilled actions
  const dispatchedActions = store.dispatch.mock.calls.map(call => call[0].type)
  expect(dispatchedActions).toEqual([
    'auth/loginUser/pending',
    'auth/loginUser/fulfilled',
  ])

  // Confirm navigation to the Home screen occurred
  expect(mockNavigate).toHaveBeenCalledWith('Home')
})
