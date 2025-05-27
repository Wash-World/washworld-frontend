import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Select from "./src/components/elements/Select";

export default function App() {
  // Location selection example
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetched locations
  const locations = [
    { label: "København", value: "1" },
    { label: "Aarhus", value: "2" },
    { label: "Odense", value: "3" },
    { label: "Aalborg", value: "4" },
    { label: "Esbjerg", value: "5" },
    { label: "Randers", value: "6" },
    { label: "Kolding", value: "7" },
    { label: "Horsens", value: "8" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select dropdown example</Text>

      <Select
        label="Location"
        selectedValue={selectedLocation}
        onValueChange={setSelectedLocation}
        options={locations}
        placeholder="Select a location"
        disabled={false}
      />

      <Text style={styles.selectedValue}>Selected location id: {selectedLocation}</Text>

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
    marginBottom: 16,
    textAlign: "center",
  },
  selectedValue: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
});
