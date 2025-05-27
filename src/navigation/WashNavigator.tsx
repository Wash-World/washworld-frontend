//  # nested stack inside Wash tab
// Stack of screens related to washing:
// SelectWash
// WashInProgress
// Feedback, etc.
// Used inside a tab in AppTabsNavigator

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SelectWashScreen from "../screens/wash/SelectWashScreen";
import WashSummaryScreen from "../screens/wash/WashSummaryScreen";
import WashInProgressScreen from "../screens/wash/WashInProgressScreen";
import WashFeedbackScreen from "../screens/wash/WashFeedbackScreen";
import FeedbackDetailsScreen from "../screens/wash/FeedbackDetailsScreen";
import WashThankYouScreen from "../screens/wash/WashThankYouScreen";

const Stack = createNativeStackNavigator();

const WashNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectWash" component={SelectWashScreen} />
      <Stack.Screen name="Summary" component={WashSummaryScreen} />
      <Stack.Screen name="InProgress" component={WashInProgressScreen} />
      <Stack.Screen name="Feedback" component={WashFeedbackScreen} />
      <Stack.Screen name="FeedbackDetails" component={FeedbackDetailsScreen} />
      <Stack.Screen name="ThankYou" component={WashThankYouScreen} />
    </Stack.Navigator>
  );
};

export default WashNavigator;
