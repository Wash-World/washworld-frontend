import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Button from "./src/components/elements/Button"; // Adjust the import path based on your project structure

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Button Variants</Text>

      <Button
        title="Primary Button"
        variant="primary"
        onPress={() => console.log("Primary pressed")}
      />

      <View style={styles.spacing} />

      <Button
        title="Delete Button"
        variant="delete"
        onPress={() => console.log("Delete pressed")}
      />

      <View style={styles.spacing} />

      <Button title="Disabled Button" disabled onPress={() => console.log("Disabled pressed")} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  spacing: {
    height: 16,
  },
});
