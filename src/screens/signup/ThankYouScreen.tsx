import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type ScreenProps = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.THANK_YOU
>;

type Props = ScreenProps & {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

function ThankYouScreen({ navigation, setIsAuthenticated }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>THANK YOU FOR YOUR PURCHASE</Text>
      <Text>
        We cannot just navigate to Home, because this stack naviation and tab
        navigations are siblings under the root navigator
      </Text>
      <Text>Here we will update the Redux context</Text>
      <Button
        title="Go to Home"
        onPress={() => {
          setIsAuthenticated(true); // This triggers RootNavigator to switch to AppTabs
        }}
      />
    </View>
  );
}

export default ThankYouScreen;
