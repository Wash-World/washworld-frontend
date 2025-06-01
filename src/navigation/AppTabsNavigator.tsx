import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

import HomeScreen from "../screens/home/HomeScreen";
import LocationScreen from "../screens/location/LocationScreen";
import HelpScreen from "../screens/help/HelpScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import WashNavigator from "./WashNavigator";
import { ROUTES } from "../constants/routes";

const Tab = createBottomTabNavigator();

export default function AppTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"] = "home-outline";

          switch (route.name) {
            case ROUTES.HOME:
              iconName = "home-outline";
              break;
            case ROUTES.LOCATION:
              iconName = "location-outline";
              break;
            case ROUTES.HELP:
              iconName = "chatbubble-ellipses-outline";
              break;
            case ROUTES.PROFILE:
              iconName = "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.greenBrand,
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.LOCATION} component={LocationScreen} />

      {/* ───────────────────────────────────────────────────────────────────────
          For the “WashStack” tab, we add a `listeners` prop. 
          Whenever the user presses this tab, we force‐navigate to the 
          very first screen (“WashWaitScreen”) of that stack.
      ─────────────────────────────────────────────────────────────────────── */}
      <Tab.Screen
        name={ROUTES.WASH.STACK}
        component={WashNavigator}
        options={{
          tabBarIcon: () => (
            <View style={styles.washTabButton}>
              <Text style={styles.washTabText}>W</Text>
            </View>
          ),
          tabBarItemStyle: { marginTop: -4 },
        }}
        listeners={({ navigation }) => ({
          // On each tabPress, reset the nested Wash stack to its initial route
          tabPress: (e) => {
            // Prevent default behavior (so we can explicitly drive navigation ourselves)
            e.preventDefault();

            // Navigate to the Wash stack's first screen (WashWaitScreen)
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

const styles = StyleSheet.create({
  washTabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.greenBrand,
    alignItems: "center",
    justifyContent: "center",
  },
  washTabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
  },
});
