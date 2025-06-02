import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectPlanScreen from "../screens/signup/SelectPlanScreen";
import InsertInfoScreen from "../screens/signup/InsertInfoScreen";
import CardPaymentScreen from "../screens/signup/CardPaymentScreen";
import ThankYouScreen from "../screens/signup/ThankYouScreen";
import { ROUTES } from "../constants/routes";

export type SignUpStackParamList = {
  [ROUTES.SIGNUP.SELECT_PLAN]: undefined;

  [ROUTES.SIGNUP.INSERT_INFO]: {
    membership_id: number;
    assigned_location_api_id?: string;
    all_locations?: boolean;
  };

  [ROUTES.SIGNUP.PAYMENT]: undefined;

  [ROUTES.SIGNUP.THANK_YOU]: undefined;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();

const SignUpNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.SIGNUP.SELECT_PLAN} component={SelectPlanScreen} />
    <Stack.Screen name={ROUTES.SIGNUP.INSERT_INFO} component={InsertInfoScreen} />
    <Stack.Screen name={ROUTES.SIGNUP.PAYMENT} component={CardPaymentScreen} />
    <Stack.Screen name={ROUTES.SIGNUP.THANK_YOU} component={ThankYouScreen} />
  </Stack.Navigator>
);

export default SignUpNavigator;
