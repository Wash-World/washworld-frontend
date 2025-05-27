// # SelectPlan → InsertInfo → Payment → ThankYou
// Stack flow for multi-step signup
// Used inside AuthNavigator

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InsertInfoScreen from "../screens/signup/InsertInfoScreen";
import SelectPlanScreen from "../screens/signup/SelectPlanScreen";
import CardPaymentScreen from "../screens/signup/CardPaymentScreen";
import ThankYouScreen from "../screens/signup/ThankYouScreen";
import { ROUTES } from "../constants/routes";

// This type is used by TypeScript and React Navigation to know
// which routes exist in this navigator
// and what parameters (if any) they accept
export type SignUpStackParamList = {
  [ROUTES.SIGNUP.SELECT_PLAN]: undefined;
  [ROUTES.SIGNUP.INSERT_INFO]: undefined;
  [ROUTES.SIGNUP.PAYMENT]: undefined;
  [ROUTES.SIGNUP.THANK_YOU]: undefined;
};
// If you don't use these types,
// navigation props default to any,
// so you lose autocompletion and type safety.

type Props = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();
// Now Stack.Screen knows which screens are allowed (from SignUpStackParamList).

const SignUpNavigator = ({ setIsAuthenticated }: Props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.SIGNUP.SELECT_PLAN}
        component={SelectPlanScreen}
      />
      <Stack.Screen
        name={ROUTES.SIGNUP.INSERT_INFO}
        component={InsertInfoScreen}
      />
      <Stack.Screen
        name={ROUTES.SIGNUP.PAYMENT}
        component={CardPaymentScreen}
      />
      <Stack.Screen name={ROUTES.SIGNUP.THANK_YOU}>
        {(navProps) => (
          <ThankYouScreen
            {...navProps}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default SignUpNavigator;
