import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import AppTabsNavigator from "./AppTabsNavigator";
import { ROUTES } from "../constants/routes";
import { useAppDispatch, useAppSelector } from "../store";
import { getToken } from "../hooks/secureStore";
import { setToken } from "../store/authSlice";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const dispatch = useAppDispatch(); // Gives you access to the Redux dispatch() function to manually update state.
  const token = useAppSelector((state) => state.auth.token); // Reads the token from Redux using useAppSelector.
  // This value resets when the app restarts — unless we restore it.
  const isAuthenticated = !!token;

  const [isLoading, setIsLoading] = useState(true);

  // This runs once on app startup.
  useEffect(() => {
    const restoreAuth = async () => {
      const savedToken = await getToken(); // 1. Fetch token from SecureStore
      if (savedToken) {
        dispatch(setToken(savedToken)); // 2. Put it back into Redux
      }
      setIsLoading(false); // 3. Stop showing the splash screen
    };

    restoreAuth();
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
