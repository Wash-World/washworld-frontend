import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants/routes";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginUser } from "../../store/authSlice";
import { saveToken } from "../../hooks/secureStore";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.LOGIN>;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (status === "succeeded" && token) {
      saveToken(token);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.APP_TABS as any }],
      });
    }
  }, [status, token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>WASH</Text>
            <Text style={styles.logoSubText}>WORLD</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="email@example.com" placeholderTextColor={colors.gray40} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="********" placeholderTextColor={colors.gray40} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.iconButton}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={colors.gray60} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign In Button */}
          {status === "loading" ? (
            <ActivityIndicator size="large" color={colors.greenBrand} style={styles.signInButton} />
          ) : (
            <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={!email || !password}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => {
              /* navigate to ForgotPassword if exists */
            }}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Not a member? </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.SIGNUP.STACK, {
                  screen: ROUTES.SIGNUP.SELECT_PLAN,
                })
              }
            >
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.gray80,
  },
  logoSubText: {
    fontSize: 16,
    letterSpacing: 4,
    color: colors.gray60,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.gray80,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray20,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.gray80,
  },
  iconButton: {
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: colors.greenBrand,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotText: {
    color: colors.gray60,
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 60,
  },
  spacer: {
    flex: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  signupText: {
    fontSize: 14,
    color: colors.gray80,
  },
  signupLink: {
    fontSize: 14,
    color: colors.greenBrand,
    textDecorationLine: "underline",
  },
});
