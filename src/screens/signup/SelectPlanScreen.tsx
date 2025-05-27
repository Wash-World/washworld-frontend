import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";

type Props = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.SELECT_PLAN
>;

function SelectPlanScreen({ navigation, route }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Select Plan Screen</Text>
      <Button
        title="Go to Insert Info"
        onPress={() => navigation.navigate(ROUTES.SIGNUP.INSERT_INFO)}
      />
    </View>
  );
}

export default SelectPlanScreen;
