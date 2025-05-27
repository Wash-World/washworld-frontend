import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Forgot Password Screen</Text>
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

export default ForgotPasswordScreen;
