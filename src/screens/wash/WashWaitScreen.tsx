import React, { useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "../../services/types/location";
import { fetchLocations } from "../../services/api/locations";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";

type SelectInfo = {
  label: string;
  value: string;
  halls: number;
};

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.WAIT>;

export default function WashWaitScreen({ navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);

  // 1. Fetch & map locations (errors fall through to data = [])
  const { data: options = [], isLoading } = useQuery<SelectInfo[], Error>({
    queryKey: ["locations", user.id],
    queryFn: async () => {
      const raw: Location[] = await fetchLocations();
      return raw.map((loc) => ({
        label: loc.name,
        value: loc.Location_id,
        halls: loc.service_units.hall.total_count,
      }));
    },
  });

  // 2. Choose either the user's single location or a random one
  const chosen = useMemo<SelectInfo | null>(() => {
    if (isLoading) return null;

    if (!user.all_locations && user.assigned_location_api_id) {
      return options.find((o) => o.value === user.assigned_location_api_id) || options[0] || { label: "Unknown", value: "", halls: 0 };
    }

    return options.length ? options[Math.floor(Math.random() * options.length)] : { label: "Unknown", value: "", halls: 0 };
  }, [isLoading, options, user.all_locations, user.assigned_location_api_id]);

  // 3. After 10s navigate to the SELECT screen
  useEffect(() => {
    if (!chosen) return;
    const t = setTimeout(() => {
      navigation.replace(ROUTES.WASH.SELECT, {
        locationId: chosen.value,
        locationName: chosen.label,
        locationAddress: chosen.value,
        hallsCount: chosen.halls,
      });
    }, 5_000);
    return () => clearTimeout(t);
  }, [navigation, chosen]);

  // 4. Render spinner or chosen info
  if (isLoading || !chosen) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{chosen.label}</Text>
        <Text style={styles.locationAddress}>{chosen.value}</Text>
      </View>
      <View style={styles.body}>
        <Feather name="refresh-cw" size={64} color={colors.gray40} />
        <Text style={styles.waitText}>Waiting for your car plate to be read…</Text>
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
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  waitText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
    color: colors.gray60,
  },
});
