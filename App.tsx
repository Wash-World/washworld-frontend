import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Checkbox from "./src/components/elements/Checkbox";

export default function App() {
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkbox Example</Text>

      <Checkbox
        label="Free access to all car washes"
        checked={agreed}
        onChange={() => setAgreed(!agreed)}
      />

      <Text style={styles.statusText}>
        Free access: {agreed ? "✅" : "❌"}
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
