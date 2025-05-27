// navigation/SignUpNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectPlanScreen from "../screens/signup/SelectPlanScreen";
import InsertInfoScreen from "../screens/signup/InsertInfoScreen";
import CardPaymentScreen from "../screens/signup/CardPaymentScreen";
import ThankYouScreen from "../screens/signup/ThankYouScreen";
import { ROUTES } from "../constants/routes";

// 1️⃣ Update the params for each step:
export type SignUpStackParamList = {
  // No params needed on entry
  [ROUTES.SIGNUP.SELECT_PLAN]: undefined;

  // After choosing plan & location
  [ROUTES.SIGNUP.INSERT_INFO]: {
    membership_id: number;
    // one of these two will be set:
    assigned_location_api_id?: string;
    all_locations?: boolean;
  };

  // After filling out user info
  [ROUTES.SIGNUP.PAYMENT]: {
    // your CreateUserDto fields up to here
    name: string;
    lastname: string;
    email: string;
    password: string;
    mobile_num: string;
    carplate?: string;

    // plus the plan/location from before
    membership_id: number;
    assigned_location_api_id?: string;
    all_locations?: boolean;
  };

  // No params needed on thank‐you
  [ROUTES.SIGNUP.THANK_YOU]: undefined;
};

type Props = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();

const SignUpNavigator = ({ setIsAuthenticated }: Props) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.SIGNUP.SELECT_PLAN} component={SelectPlanScreen} />

    <Stack.Screen name={ROUTES.SIGNUP.INSERT_INFO} component={InsertInfoScreen} />

    <Stack.Screen name={ROUTES.SIGNUP.PAYMENT} component={CardPaymentScreen} />

    <Stack.Screen name={ROUTES.SIGNUP.THANK_YOU}>{(navProps) => <ThankYouScreen {...navProps} setIsAuthenticated={setIsAuthenticated} />}</Stack.Screen>
  </Stack.Navigator>
);

export default SignUpNavigator;
