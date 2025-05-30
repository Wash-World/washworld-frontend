// Main app layout after login
// Shows bottom tabs: Home, Profile, Wash, etc.
// Each tab can be a single screen or a whole navigator (like WashNavigator)

// 🔧 Redux Note:
// You might want to display user info in the Profile screen,
// so later you’ll use Redux selectors inside ProfileScreen.tsx.
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import LocationScreen from "../screens/location/LocationScreen";
import HelpScreen from "../screens/help/HelpScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WashNavigator from "./WashNavigator";
import { ROUTES } from "../constants/routes";

const Tab = createBottomTabNavigator();

export default function AppTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.LOCATION} component={LocationScreen} />

      <Tab.Screen
        name={ROUTES.WASH.STACK}
        component={WashNavigator}
        // every time the Wash tab is pressed, navigate the nested WashStack
        // back to its initial route (ROUTES.WASH.WAIT)
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // first, prevent default behavior so we can control the reset
            e.preventDefault();
            // then navigate back into the Wash stack, pointing at its first screen
            navigation.navigate(ROUTES.WASH.STACK, {
              screen: ROUTES.WASH.WAIT,
            });
          },
        })}
      />

      <Tab.Screen name={ROUTES.HELP} component={HelpScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
