import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import AuthNavigator from "./AuthNavigator";
import AppTabsNavigator from "./AppTabsNavigator";
import { ROUTES } from "../constants/routes";
import { useAppDispatch, useAppSelector } from "../store";
import { deleteToken, getToken } from "../hooks/secureStore";
import { clearAuth, setToken } from "../store/authSlice";
import { fetchCurrentUser } from "../store/authSlice";

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
      try {
        const savedToken = await getToken();
        if (!savedToken) {
          // No token in SecureStore → skip fetch
          setIsLoading(false);
          return;
        }

        // Put the token into Redux first:
        dispatch(setToken(savedToken));

        // WAIT for fetchCurrentUser to complete:
        const resultAction = await dispatch(fetchCurrentUser(savedToken));

        if (fetchCurrentUser.rejected.match(resultAction)) {
          // fetchCurrentUser failed (likely token expired or invalid)
          dispatch(clearAuth());
          await deleteToken(); // Remove invalid token from SecureStore
        }
      } catch (error) {
        console.error("Error restoring token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>{isLoading ? <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} /> : !isAuthenticated ? <Stack.Screen name={ROUTES.AUTH_STACK} component={AuthNavigator} /> : <Stack.Screen name={ROUTES.APP_TABS} component={AppTabsNavigator} />}</Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
