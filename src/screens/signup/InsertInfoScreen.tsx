import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type Props = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.INSERT_INFO
>;

function InsertInfoScreen({ navigation, route }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Insert Info Screen</Text>
      <Button
        title="Go to Payment"
        onPress={() => navigation.navigate(ROUTES.SIGNUP.PAYMENT)}
      />
    </View>
  );
}

export default InsertInfoScreen;
