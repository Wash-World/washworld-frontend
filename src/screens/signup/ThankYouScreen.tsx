import React from "react";
import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type ScreenProps = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.THANK_YOU
>;

function ThankYouScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>THANK YOU FOR YOUR PURCHASE</Text>
      <Text>
        We cannot just navigate to Home, because this stack naviation and tab
        navigations are siblings under the root navigator
      </Text>
      <Text>Here we will update the Redux context</Text>
    </View>
  );
}

export default ThankYouScreen;
