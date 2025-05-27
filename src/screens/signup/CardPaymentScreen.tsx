import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type Props = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.PAYMENT
>;

function CardPaymentScreen({ navigation, route }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Insert Card Info Screen</Text>
      <Button
        title="PAY"
        onPress={() => navigation.navigate(ROUTES.SIGNUP.THANK_YOU)}
      />
    </View>
  );
}

export default CardPaymentScreen;
