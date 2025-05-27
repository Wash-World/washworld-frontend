import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

interface ServiceChipProps {
  label: string;
  active: boolean;
}

const ServiceChip: React.FC<ServiceChipProps> = ({ label, active }) => (
  <View style={styles.container}>
    <Ionicons name="checkmark-circle" size={20} color={active ? colors.greenBrand : colors.gray20} />
    <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}> {label} </Text>
  </View>
);

export default ServiceChip;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 4,
  },
  text: {
    fontSize: 12,
    marginLeft: 6,
  },
  textActive: {
    color: colors.gray80,
  },
  textInactive: {
    color: colors.gray40,
  },
});
