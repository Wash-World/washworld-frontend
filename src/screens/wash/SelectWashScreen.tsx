import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import colors from "../../constants/colors";
import MembershipCardWash from "../../components/wash/MembershipCardWash";
import Button from "../../components/elements/Button";
import { useMemberships } from "../../hooks/useMemberships";
import { WashStackParamList } from "../../navigation/WashNavigator";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.SELECT>;

export default function SelectWashScreen({ route, navigation }: Props) {
  const { locationId, locationName, locationAddress, hallsCount } = route.params;
  const user = useAppSelector((s) => s.auth.user);

  // 1️⃣ fetch via React-Query
  const { data: plans = [], isLoading, isError } = useMemberships();

  // 2️⃣ track selected
  const [activeId, setActiveId] = useState<number | null>(null);

  // 3️⃣ once plans arrive, pre-select
  useEffect(() => {
    if (!isLoading && plans.length && activeId === null) {
      const match = plans.find((p) => p.plan === user.membership_plan);
      setActiveId(match ? match.membership_id : plans[0].membership_id);
    }
  }, [isLoading, plans, user.membership_plan, activeId]);

  // 4️⃣ NEXT handler
  const onNext = () => {
    if (activeId == null) {
      return Alert.alert("Select a wash", "Please pick a plan first.");
    }
    const chosen = plans.find((p) => p.membership_id === activeId)!;
    navigation.replace(ROUTES.WASH.IN_PROGRESS, {
      locationId,
      locationName,
      locationAddress,
      hallsCount,
      membershipId: chosen.membership_id,
      durationWash: chosen.duration_wash,
    });
  };

  // 5️⃣ loading / error UIs
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Oops—couldn't load wash plans. Try again later.</Text>
      </SafeAreaView>
    );
  }

  // 6️⃣ render
  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.locationName}>{locationName}</Text>
        <Text style={styles.locationAddress}>{locationAddress}</Text>
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
          <Text style={styles.value}>#{hallsCount}</Text>
        </View>
      </View>

      {/* Select a wash */}
      <Text style={[styles.sectionTitle, styles.selectTitle]}>Select a wash</Text>
      <FlatList
        data={plans}
        keyExtractor={(p) => p.membership_id.toString()}
        renderItem={({ item }) => {
          // 🚩 only allow if user is "All Inclusive" OR this is exactly their own plan
          const isAllowed = user.membership_plan === "Brilliant" || item.plan === user.membership_plan;

          return (
            <MembershipCardWash
              plan={item.plan}
              durationWash={item.duration_wash}
              active={item.membership_id === activeId}
              disabled={!isAllowed}
              onPress={() => {
                if (isAllowed) setActiveId(item.membership_id);
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.list}
      />

      <View style={styles.nextWrapper}>
        <Button title="NEXT ›" onPress={onNext} disabled={activeId == null} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorText: { color: colors.error, fontSize: 16, textAlign: "center" },

  header: {
    backgroundColor: colors.gray05,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  locationName: { fontSize: 20, fontWeight: "bold", color: colors.gray80 },
  locationAddress: { fontSize: 14, color: colors.gray60, marginTop: 4 },
  hallsCount: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 4,
    fontWeight: "600",
  },

  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  selectTitle: { marginTop: 24 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  label: { fontSize: 14, color: colors.gray60 },
  value: { fontSize: 16, fontWeight: "600", color: colors.gray80 },

  list: { paddingHorizontal: 16, paddingBottom: 140 },
  nextWrapper: { position: "absolute", bottom: 24, right: 16 },
});
