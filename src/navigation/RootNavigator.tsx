// Entry point for our navigation based on authentication status
// Checks if user is logged in
// Renders splash → auth flow or main app. Decide here what to show!

// 🔧 JWT Integration Note:
// Later, you’ll read the JWT token from Redux (e.g. useSelector(state => state.auth.token))
// and use that to determine isAuthenticated.

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import AppTabsNavigator from "./AppTabsNavigator";
import { ROUTES } from "../constants/routes";
import { useAppSelector } from "../store";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fake splash loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name={ROUTES.AUTH_STACK} component={AuthNavigator} />
        ) : (
          <Stack.Screen name={ROUTES.APP_TABS} component={AppTabsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
