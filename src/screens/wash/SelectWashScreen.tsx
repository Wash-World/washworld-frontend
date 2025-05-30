// src/screens/wash/SelectWashScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import colors from "../../constants/colors";
import MembershipCardWash from "../../components/wash/MembershipCardWash";
import Button from "../../components/elements/Button";
import { LAN_IP } from "../../constants/env";
import { WashStackParamList } from "../../navigation/WashNavigator";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.SELECT>;

// shape of each plan from the backend
interface Membership {
  membership_id: number;
  plan: string;
  duration_wash: number;
}

export default function SelectWashScreen({ route, navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const { locationId, locationName, locationAddress, hallsCount } = route.params;

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${LAN_IP}:3000/memberships`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: Membership[]) => {
        setMemberships(data);
        if (data.length) {
          // Preselect the user's existing plan if it matches
          const match = data.find((m) => m.plan === user.membership_plan);
          setActiveId(match ? match.membership_id : data[0].membership_id);
        }
      })
      .catch((err) => {
        console.error("Fetch memberships error:", err);
        Alert.alert("Error", "Could not load membership plans.");
      })
      .finally(() => setLoading(false));
  }, [user.membership_plan]);

  const onNext = () => {
    if (activeId == null) {
      return Alert.alert("Select a wash", "Please pick a plan first.");
    }
    const chosen = memberships.find((m) => m.membership_id === activeId)!;
    navigation.replace(ROUTES.WASH.IN_PROGRESS, {
      locationId,
      locationName,
      locationAddress,
      hallsCount,
      membershipId: chosen.membership_id,
      durationWash: chosen.duration_wash,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.locationName}>{locationName}</Text>
        <Text style={styles.locationAddress}>{locationAddress}</Text>
        <Text style={styles.hallsCount}>Halls: {hallsCount}</Text>
      </View>

      {/* Your info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Car Plate</Text>
          <Text style={styles.value}>{user.carplate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vaskehøll</Text>
          <Text style={styles.value}>#{locationId}</Text>
        </View>
      </View>

      {/* Select a wash */}
      <Text style={[styles.sectionTitle, styles.selectTitle]}>Select a wash</Text>
      <FlatList data={memberships} keyExtractor={(m) => m.membership_id.toString()} renderItem={({ item }) => <MembershipCardWash plan={item.plan} durationWash={item.duration_wash} active={item.membership_id === activeId} onPress={() => setActiveId(item.membership_id)} />} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} contentContainerStyle={styles.list} />

      {/* NEXT */}
      <View style={styles.nextWrapper}>
        <Button title="NEXT ›" onPress={onNext} disabled={activeId == null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.gray05,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  locationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gray80,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 4,
  },
  hallsCount: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 4,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  selectTitle: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: colors.gray60,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray80,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  nextWrapper: {
    position: "absolute",
    bottom: 24,
    right: 16,
  },
});
