// screens/wash/SelectWashScreen.tsx

import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WashStackParamList } from "../../navigation/WashNavigator";
import MembershipCardWash from "../../components/wash/MembershipCardWash";
import Button from "../../components/elements/Button";
import colors from "../../constants/colors";

type Props = NativeStackScreenProps<WashStackParamList, "SelectWash">;

export default function SelectWashScreen({ navigation }: Props) {
  // Hardcoded user/location info for now
  const locationName = "Location Name";
  const locationAddress = "Roskildevej 376, 2630 Taastrup";
  const carPlate = "DK12345";
  const vaskehall = "#2";

  // Static list of washes; later this can be fetched
  const washOptions = [
    { id: 1, plan: "Guld", price: 0, duration: 10 },
    { id: 2, plan: "Premium", price: 0, duration: 15 },
    { id: 3, plan: "All Inclusive", price: 119, duration: 20 },
  ];

  const [activeWashId, setActiveWashId] = useState<number | null>(null);
  const canProceed = activeWashId !== null;
  console.log("greenBrand is:", colors.greenBrand);
  return (
    <ScrollView style={styles.root}>
      {/* Header with location */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{locationName}</Text>
        <Text style={styles.headerSubtitle}>{locationAddress}</Text>
      </View>

      <View style={styles.container}>
        
        {/* Your info section */}
        <Text style={styles.sectionLabel}>Your info</Text>
        <Text style={[styles.sectionLabel, { color: "#06C167" }]}>
+   Your info
+ </Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Car Plate</Text>
            <Text style={styles.infoValue}>{carPlate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vaskehall</Text>
            <Text style={styles.infoValue}>{vaskehall}</Text>
          </View>
        </View>

        {/* Select a wash */}
        <Text style={styles.sectionLabel}>Select a wash</Text>
        {washOptions.map((w) => (
          <View key={w.id} style={styles.cardWrapper}>
            <MembershipCardWash
              plan={w.plan}
              durationWash={w.duration}
              active={w.id === activeWashId}
              onPress={() => setActiveWashId(w.id)}
            />
          </View>
        ))}

        {/* Next button */}
        <View style={styles.nextButton}>
          <Button
            title="NEXT"
            onPress={() => (navigation as any).navigate("InProgress")}
            disabled={!canProceed}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray10,
  },
  header: {
    backgroundColor: colors.gray20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.gray80,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 4,
  },
  container: {
    padding: 20,
    backgroundColor: colors.white, // ← back!
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    //color: colors.greenBrand,
    color: "#06C167", 
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray60,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray80,
    marginTop: 4,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 32,
  },
});

