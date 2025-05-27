// Stack of Login, Forgot Password, and SignUp flow
// Used by unauthenticated users

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpNavigator from "../navigation/SignUpNavigator";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import { ROUTES } from "../constants/routes";
import { SignUpStackParamList } from "../navigation/SignUpNavigator";
const Stack = createNativeStackNavigator();

// src/navigation/AuthNavigator.tsx or wherever you want
export type AuthStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.SIGNUP.STACK]: {
    screen?: keyof SignUpStackParamList; // allows nested navigation to a screen inside SignUpNavigator
    params?: object; // optional params for nested screen
  };
};

type AuthNavigatorProps = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthNavigator = ({ setIsAuthenticated }: AuthNavigatorProps) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />

      <Stack.Screen name={ROUTES.SIGNUP.STACK}>
        {() => <SignUpNavigator setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
