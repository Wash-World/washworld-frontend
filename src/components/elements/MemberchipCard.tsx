import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export interface MembershipCardProps {
  plan: string;
  price: number;
  durationWash: number;
  active: boolean;
  onPress: () => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ plan, price, durationWash, active, onPress }) => (
  <TouchableOpacity style={[styles.card, active ? styles.cardActive : styles.cardInactive]} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.planLabel, active && styles.labelActive]}>{plan}</Text>
    <Text style={styles.priceText}>{price} kr.</Text>
    <Text style={styles.durationText}>{durationWash} minutes</Text>
  </TouchableOpacity>
);

export default MembershipCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cardActive: {
    borderColor: colors.greenBrand,
  },
  cardInactive: {
    borderColor: colors.gray20,
  },
  planLabel: {
    fontSize: 14,
    color: colors.gray80,
    marginBottom: 8,
  },
  labelActive: {
    color: colors.greenBrand,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
  },
  durationText: {
    fontSize: 12,
    color: colors.gray40,
    marginTop: 4,
  },
});
