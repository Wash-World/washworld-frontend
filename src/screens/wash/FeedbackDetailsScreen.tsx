import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function FeedbackDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FeedbackDetailsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, color: colors.gray80 },
});
