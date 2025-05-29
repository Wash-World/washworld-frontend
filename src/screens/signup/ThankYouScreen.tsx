import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type ScreenProps = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.THANK_YOU
>;

function ThankYouScreen({ navigation }: ScreenProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace(ROUTES.LOGIN); // 👈 use replace so user can't go back
    }, 3000); // 3 seconds delay before redirect

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>THANK YOU FOR YOUR PURCHASE</Text>
      <Text>You will be redirected to the login page shortly.</Text>
    </View>
  );
}

export default ThankYouScreen;
