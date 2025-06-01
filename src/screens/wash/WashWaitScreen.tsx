import React, { useMemo, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLocations } from "../../hooks/useLocations";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";

type Option = {
  label: string;
  value: string;
  address: string;
  halls: number;
};

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.WAIT>;

export default function WashWaitScreen({ navigation }: Props) {
  //redux for users
  const user = useAppSelector((s) => s.auth.user);

  // Fetch raw Location[] via React Query hook
  const { data: locations = [], isLoading, isError } = useLocations();

  // Map raw DTOs to only the bits this screen needs, so we dont fetch everything
  const options = useMemo<Option[]>(
    () =>
      locations.map((loc: { name: string; address: string; Location_id: string; service_units: { hall: { total_count: number } } }) => ({
        label: loc.name,
        value: loc.Location_id,
        address: loc.address,
        halls: loc.service_units.hall.total_count,
      })),
    [locations]
  );

  // Pick assigned or random location if you have them all
  const chosen = useMemo<Option | null>(() => {
    if (isLoading || !options.length) return null;

    if (!user.all_locations && user.assigned_location_api_id) {
      return options.find((o) => o.value === user.assigned_location_api_id) || options[0];
    }
    const idx = Math.floor(Math.random() * options.length);
    return options[idx];
  }, [isLoading, options, user.all_locations, user.assigned_location_api_id]);

  // Navigate after 10 seconds
  useEffect(() => {
    if (!chosen) return;
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.WASH.SELECT, {
        locationId: chosen.value,
        locationName: chosen.label,
        locationAddress: chosen.address,
        hallsCount: chosen.halls,
      });
    }, 6_000);
    return () => clearTimeout(timer);
  }, [chosen, navigation]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </SafeAreaView>
    );
  }

  // Error state
  if (isError || !chosen) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Oops—couldn’t load locations. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{chosen.label}</Text>
        <Text style={styles.locationAddress}>{chosen.address}</Text>
      </View>
      <View style={styles.body}>
        <Feather name="refresh-cw" size={64} color={colors.gray40} />
        <Text style={styles.waitText}>Waiting for your car plate to be read…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    backgroundColor: colors.gray05,
    paddingTop: 16,
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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  waitText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray60,
    textAlign: "center",
  },
});
