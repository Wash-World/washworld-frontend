// src/navigation/WashNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WashWaitScreen from "../screens/wash/WashWaitScreen";
import SelectWashScreen from "../screens/wash/SelectWashScreen";
import WashInProgressScreen from "../screens/wash/WashInProgressScreen";
import WashFeedbackScreen from "../screens/wash/WashFeedbackScreen";
import FeedbackDetailsScreen from "../screens/wash/FeedbackDetailsScreen";
import WashThankYouScreen from "../screens/wash/WashThankYouScreen";
import { ROUTES } from "../constants/routes";

// 1. Define & export your stack’s param list

export type WashStackParamList = {
  [ROUTES.WASH.WAIT]: undefined;
  [ROUTES.WASH.SELECT]: {
    locationId: string;
    locationName: string;
    locationAddress: string;
    hallsCount: number;
  };
  [ROUTES.WASH.IN_PROGRESS]: {
    locationId: string;
    locationName: string;
    locationAddress: string;
    hallsCount: number;
    membershipId: number;
    durationWash: number;
  };
  [ROUTES.WASH.FEEDBACK]: { washHistoryId: number; locationId: string };
  [ROUTES.WASH.FEEDBACK_DETAILS]: {
    feedbackId: number;
    locationName: string;
    locationAddress: string;
  };
  [ROUTES.WASH.THANK_YOU]: undefined;
};

const Stack = createNativeStackNavigator<WashStackParamList>();

const WashNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.WASH.WAIT} component={WashWaitScreen} />
    <Stack.Screen name={ROUTES.WASH.SELECT} component={SelectWashScreen} />
    <Stack.Screen name={ROUTES.WASH.IN_PROGRESS} component={WashInProgressScreen} />
    <Stack.Screen name={ROUTES.WASH.FEEDBACK} component={WashFeedbackScreen} />
    <Stack.Screen name={ROUTES.WASH.FEEDBACK_DETAILS} component={FeedbackDetailsScreen} />
    <Stack.Screen name={ROUTES.WASH.THANK_YOU} component={WashThankYouScreen} />
  </Stack.Navigator>
);

export default WashNavigator;
