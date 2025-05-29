import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import colors from "../../constants/colors";

// Single feedback option
interface FeedbackCard {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  onPress: () => void;
}

// Main component that renders all options
export const FeedbackCard: React.FC = () => {
  // Hard-coded options array
  const options: FeedbackCard[] = [
    {
      title: "Great",
      description: "The wash was thorough, quick, and my car looks spotless.",
      icon: "check-circle",
      color: colors.greenBrand,
      onPress: () => {
        // navigate to success screen
        console.log("Navigating to ThankYou screen");
      },
    },
    {
      title: "Okay",
      description: "The wash was decent, but I noticed some missed spots or small issues.",
      icon: "error-outline",
      color: colors.orange,
      onPress: () => {
        // navigate to feedback details screen
        console.log("Navigating to Details screen");
      },
    },
    {
      title: "Not Good",
      description: "The wash didn’t meet my expectations. I had a problem or something didn’t work properly.",
      icon: "highlight-off",
      color: colors.error,
      onPress: () => {
        // navigate to complaint screen
        console.log("Navigating to Complaint screen");
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.title}
          style={[styles.card, { borderColor: opt.color }]}
          onPress={opt.onPress}
          activeOpacity={0.8}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: opt.color }]}>{opt.title}</Text>
            <MaterialIcons name={opt.icon} size={24} color={opt.color} style={{ color: opt.color }} />
          </View>
          <Text style={styles.description}>{opt.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: colors.gray80,
  },
});
