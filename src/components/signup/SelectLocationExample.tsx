import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Select from "../elements/Select"; 
import Checkbox from "../elements/Checkbox"; 
import colors from "../../constants/colors";

export default function SelectLocationExample() {
const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

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
      <Text style={styles.header}>Select location example</Text>

      <Select
        label="Location"
        selectedValue={selectedLocation}
        onValueChange={setSelectedLocation}
        options={locations}
        placeholder={agreed ? "All locations" : "Select a location"}
        disabled={agreed}
      />

      <Text style={styles.selectedValue}>Selected location id: {agreed ? "all" : selectedLocation ?? "None"}
</Text>

      <Checkbox
        label="Free access to all car washes"
        checked={agreed}
onChange={() => {
  const flip = !agreed;
  setAgreed(flip);
  if (flip) {
    setSelectedLocation(null);
  }
}}// Shorthand of:
// onChange={() => {
//   if (!agreed) {
//     // if Checkbox is currently unchecked, and is now being checked
//     setAgreed(true);
//     setSelectedLocation(null);
//   } else {
//     // if Checkbox is currently checked, and is now being unchecked
//     setAgreed(false);
//   }
// }}
      />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  statusText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
