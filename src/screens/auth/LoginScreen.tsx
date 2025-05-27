import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { ROUTES } from "../../constants/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.LOGIN>;
const LoginScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button
        title="Register"
        onPress={() =>
          navigation.navigate(ROUTES.SIGNUP.STACK, {
            screen: ROUTES.SIGNUP.SELECT_PLAN,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default LoginScreen;
