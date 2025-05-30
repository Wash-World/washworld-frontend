import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import colors from "../../constants/colors";

export interface MembershipCardProps {
  plan: string;
  durationWash: number;
  active: boolean;
  disabled?: boolean;
  onPress: (e: GestureResponderEvent) => void;
}

const MembershipCardWash: React.FC<MembershipCardProps> = ({ plan, durationWash, active, disabled = false, onPress }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={[styles.card, active ? styles.cardActive : styles.cardInactive, disabled && styles.cardDisabled]}>
    <View style={styles.headerRow}>
      <Text style={[styles.planLabel, active && styles.planLabelActive, disabled && styles.planLabelDisabled]}>{plan}</Text>
      <Text style={[styles.priceText, active && styles.priceTextActive, disabled && styles.priceTextDisabled]}>0,- kr</Text>
    </View>
    <Text style={[styles.durationText, active && styles.durationTextActive, disabled && styles.durationTextDisabled]}>{durationWash} minutes</Text>
  </TouchableOpacity>
);

export default MembershipCardWash;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardActive: { borderColor: colors.greenBrand },
  cardInactive: { borderColor: colors.gray20 },
  cardDisabled: { opacity: 0.5 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray80,
  },
  planLabelActive: { color: colors.greenBrand },
  planLabelDisabled: { color: colors.gray40 },

  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  priceTextActive: { color: colors.greenBrand },
  priceTextDisabled: { color: colors.gray40 },

  durationText: {
    fontSize: 12,
    color: colors.gray40,
  },
  durationTextActive: { color: colors.black },
  durationTextDisabled: { color: colors.gray40 },
});
