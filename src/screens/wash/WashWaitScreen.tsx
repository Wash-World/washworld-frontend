import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";

type Location = {
  name: string;
  Location_id: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.WAIT>;

export default function WashWaitScreen({ navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch locations
  useEffect(() => {
    fetch("https://washworld.dk/wp-json/ww/v1/locations?country=da&cacheBuster=17461100")
      .then((res) => res.json())
      .then((data: Location[]) => {
        setLocations(
          data.map((loc) => ({
            label: loc.name,
            value: loc.Location_id,
          }))
        );
      })
      .catch((err) => {
        console.error("Location fetch error:", err);
        Alert.alert("Error", "Could not load locations; using defaults.");
      })
      .finally(() => setLoading(false));
  }, []);

  // 2️⃣ Pick a location
  const location = useMemo(() => {
    if (loading) return null;
    if (!user.all_locations && user.assigned_location_api_id) {
      return locations.find((l) => l.value === user.assigned_location_api_id) || locations[0];
    }
    if (locations.length) {
      const idx = Math.floor(Math.random() * locations.length);
      return locations[idx];
    }
    return { label: "Unknown Location", value: "" };
  }, [loading, locations, user]);

  // 3️⃣ After 10s, go to SelectWash
  useEffect(() => {
    if (!location) return;
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.WASH.SELECT, {
        locationId: location.value,
      });
    }, 5_000);
    return () => clearTimeout(timer);
  }, [navigation, location]);

  // Loading spinner
  if (loading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  // Main UI
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{location.label}</Text>
        <Text style={styles.locationAddress}>{location.value}</Text>
      </View>

      <View style={styles.body}>
        <Feather name="refresh-cw" size={64} color={colors.gray40} />
        <Text style={styles.waitText}>Waiting for your card plate to be read…</Text>
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
