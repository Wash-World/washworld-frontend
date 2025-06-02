import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileForm from "../ProfileForm";

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

    onChangeFirstName: jest.fn(),
    onChangeLastName: jest.fn(),
    onChangePhone: jest.fn(),
    onChangeEmail: jest.fn(),
    onChangePassword: jest.fn(),
    onChangeConfirm: jest.fn(),
    onToggleShowPwd: jest.fn(),
    onToggleShowConfirm: jest.fn(),
    onBlurFirstName: jest.fn(),
    onBlurLastName: jest.fn(),
    onBlurPhone: jest.fn(),
    onBlurEmail: jest.fn(),
    onBlurPassword: jest.fn(),
    onBlurConfirm: jest.fn(),
    passwordIcon: null,
    confirmIcon: null,
  };

  it("renders all input fields", () => {
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <ProfileForm {...mockProps} />
    );

    expect(getByPlaceholderText("John")).toBeTruthy(); // First Name
    expect(getByPlaceholderText("Doe")).toBeTruthy(); // Last Name
    expect(getByPlaceholderText("123456")).toBeTruthy(); // Phone number
    expect(getByPlaceholderText("johndoe@email.com")).toBeTruthy(); // Email

    const passwordFields = getAllByPlaceholderText("******");
    expect(passwordFields.length).toBe(2); // Password + Confirm password
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
