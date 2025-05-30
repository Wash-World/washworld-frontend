import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { ROUTES } from "../../constants/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import InputField from "../../components/elements/InputField";
import colors from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginUser } from "../../store/authSlice";
import { useEffect } from "react";
import { saveToken } from "../../hooks/secureStore";

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.LOGIN>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
    console.log("handleLogin - Token:", token);
  };

  useEffect(() => {
    console.log("Auth status:", status);
    console.log("useEffect - Token:", token);
    if (status === "succeeded" && token) {
      saveToken(token); // <-- Save the token securely

      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.APP_TABS }],
      });
    }
  }, [status, token]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <InputField
        label="Email"
        placeholder="email@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <InputField
        label="Password"
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {status === "loading" ? (
        <ActivityIndicator  testID="activity-indicator"/>
      ) : (
        <Button title="Login"  testID="login-button" onPress={handleLogin} />
      )}

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
  container: { padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
  error: { color: "red", marginVertical: 10 },
});

export default LoginScreen;
