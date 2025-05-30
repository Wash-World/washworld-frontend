import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";

// Props for the MembershipCard.
// - plan: the name of the subscription plan.
// - durationWash: how many minutes the wash lasts.
// - active: whether this card is currently selected.
// - onPress: callback when the user taps the card.
export interface MembershipCardProps {
  plan: string;
  durationWash: number;
  active: boolean;
  onPress: () => void;
}

const MembershipCardWash: React.FC<MembershipCardProps> = ({ plan, durationWash, active, onPress }) => (
  // TouchableOpacity gives us press feedback.
  // We merge the base card style with either the active or inactive border.
  <TouchableOpacity
    style={[styles.card, active ? styles.cardActive : styles.cardInactive]}
    onPress={onPress}
    activeOpacity={0.8} // slightly dim on press
  >
    {/* Plan name & Price */}
    <View style={styles.headerRow}>
      <Text style={[styles.planLabel, active && styles.planLabelActive]}>{plan}</Text>

      <Text style={[styles.priceText, active && styles.priceTextActive]}>0,- kr</Text>
    </View>

    {/* Duration in minutes */}
    <Text style={[styles.durationText, active && styles.durationTextActive]}>{durationWash} minutes</Text>
  </TouchableOpacity>
);

export default MembershipCardWash;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 8, // ← adds space above & below each card
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  // Green border when active
  cardActive: {
    borderColor: colors.greenBrand,
  },
  // Grey border when inactive
  cardInactive: {
    borderColor: colors.gray20,
  },
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
    marginBottom: 8,
    textAlign: "left",
  },
  // Make the plan label green when active
  planLabelActive: {
    color: colors.greenBrand,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  priceTextActive: {
    color: colors.greenBrand,
  },
  durationText: {
    fontSize: 12,
    color: colors.gray40,
    textAlign: "left",
  },
  // Optionally adjust duration color when active (if desired)
  durationTextActive: {
    color: colors.black,
  },
});
