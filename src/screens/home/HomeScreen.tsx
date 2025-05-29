import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store";

const HomeScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  // console.log("User in Redux:", user);

  return (
    <View style={styles.container}>
      <Text>Welcome, {user?.name || "Guest"}</Text>
      <Text>
        Your car: {user?.carplate || "You don't have a car registered"}
      </Text>
      <Text>
        Your membership: {user?.membership_plan || "You don't have a plan"}
      </Text>
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

export default HomeScreen;
