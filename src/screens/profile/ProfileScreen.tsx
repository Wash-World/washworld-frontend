import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppDispatch } from "../../store";
import { useNavigation } from "@react-navigation/native";
import { clearAuth } from "../../store/authSlice";
import { deleteToken } from "../../hooks/secureStore";
import { ROUTES } from "../../constants/routes";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    //Clear auth state in Redux
    dispatch(clearAuth());

    // Remove the token from SecureStore
    await deleteToken();

    //Reset navigation to the Auth flow
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.AUTH_STACK }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Screen</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#E53E3E", // red-ish “danger” color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
