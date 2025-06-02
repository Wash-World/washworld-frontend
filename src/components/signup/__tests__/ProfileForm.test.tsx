import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileForm from "../ProfileForm";

// We are mimicking a real-world situation
// where a form is submitted without required fields filled out,
// and we expect to show validation errors.

describe("ProfileForm", () => {
  const mockProps = {
    firstName: "John",
    lastName: "Doe",
    phone: "+45 12345678",
    email: "john@example.com",
    password: "password",
    confirm: "password",
    showPwd: false,
    showConfirm: false,
    errors: {},

    // These are fake event handlers. In the real app, when a user types in a form field,
    // the component calls a function like onChangeFirstName to update the form state.
    // In the test, we just want to make sure those functions exist so the component
    // doesn’t crash when trying to call them.
    onChangeFirstName: jest.fn(),
    onChangeLastName: jest.fn(),
    onChangePhone: jest.fn(),
    onChangeEmail: jest.fn(),
    onChangePassword: jest.fn(),
    onChangeConfirm: jest.fn(),
    onToggleShowPwd: jest.fn(),
    onToggleShowConfirm: jest.fn(),
    onNext: jest.fn(),
    passwordIcon: null,
    confirmIcon: null,
  };

  it("renders all input fields", () => {
    const { getByPlaceholderText } = render(<ProfileForm {...mockProps} />);

    expect(getByPlaceholderText("John")).toBeTruthy();
    expect(getByPlaceholderText("Doe")).toBeTruthy();
    expect(getByPlaceholderText("+45 123456789")).toBeTruthy();
    expect(getByPlaceholderText("johndoe@email.com")).toBeTruthy();
    // expect(getByPlaceholderText("******")).toBeTruthy();
  });

  it("calls onChangeFirstName when typing", () => {
    const { getByPlaceholderText } = render(<ProfileForm {...mockProps} />);
    const input = getByPlaceholderText("John");

    fireEvent.changeText(input, "Jane");
    expect(mockProps.onChangeFirstName).toHaveBeenCalledWith("Jane");
  });

  it("displays error messages", () => {
    const propsWithErrors = {
      ...mockProps,
      errors: {
        firstName: "Required",
        email: "Invalid email",
      },
    };

    const { getByText } = render(<ProfileForm {...propsWithErrors} />);
    expect(getByText("Required")).toBeTruthy();
    expect(getByText("Invalid email")).toBeTruthy();
  });
});
