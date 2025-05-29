import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import MembershipCard from "../../components/elements/MemberchipCard";
import colors from "../../constants/colors";
import AllServiceChips from "../../components/signup/AllServiceChips";
import Select from "../../components/elements/Select";
import Checkbox from "../../components/elements/Checkbox";
import Button from "../../components/elements/Button";
import { useAppDispatch } from "../../store";
import { setPlan } from "../../store/signupSlice";
import { LAN_IP } from "../../constants/env";
import { useLocations } from "../../hooks/useLocations";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.SELECT_PLAN>;

interface Membership {
  membership_id: number;
  plan: string;
  price: number;
  duration_wash: number;
  services: { service_id: number; name: string }[];
}

export interface LocationOption {
  label: string;
  value: string;
}

export default function SelectPlanScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [agreeAll, setAgreeAll] = useState(false);

  // 🔌  LOCALHOST SETUP FOR EXPO GO (MAC & WINDOWS):
  //
  // • macOS:
  //     1. Open Terminal.
  //     2. Run:  ipconfig getifaddr en0
  //     3. Use the printed IP (e.g. 192.168.1.42) as your LAN_IP.
  //
  // • Windows:
  //     1. Open Command Prompt.
  //     2. Run:  ipconfig
  //     3. Under your Wi-Fi/Ethernet adapter, find “IPv4 Address”
  //        (e.g. 192.168.0.123) and use that as your LAN_IP.
  // Replace with your LAN IP for Expo Go:

  // const LAN_IP = "10.58.131.25";§

  useEffect(() => {
    fetch(`http://${LAN_IP}:3000/memberships`)
      .then((res) => res.json())
      .then((data: Membership[]) => {
        setMemberships(data);
        if (data.length) {
          setActiveId(data[0].membership_id);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // const { data: locations = [], isLoading: locLoading } = useLocations();
  const { data: locations = [], isLoading: locLoading } = useLocations();
  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc.Location_id,
  }));

  if (loading || locLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  // determine currently selected plan
  const currentPlan = memberships.find((m) => m.membership_id === activeId) || memberships[0];

  // extract service names for chips
  const activeServices = currentPlan.services.map((s) => s.name);

  const canProceed = agreeAll || Boolean(selectedLocation);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Which plan suits you?</Text>

        <View style={styles.cardsRow}>
          {memberships.map((m) => (
            <MembershipCard
              key={m.membership_id}
              plan={m.plan}
              price={m.price}
              durationWash={m.duration_wash}
              active={m.membership_id === activeId}
              onPress={() => setActiveId(m.membership_id)}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <AllServiceChips activeServices={activeServices} />
        <Text style={styles.sectionTitle}>Where do you want to wash?</Text>

        <Select
          label="Location"
          options={locationOptions}
          selectedValue={selectedLocation ?? ""}
          onValueChange={setSelectedLocation}
          placeholder={agreeAll ? "All locations" : "Select a location"}
          disabled={agreeAll}
        />

        <Checkbox
          label="Free access to all car washes with 10kr/month"
          checked={agreeAll}
          onChange={() => {
            const next = !agreeAll;
            setAgreeAll(next);
            if (next) setSelectedLocation(null);
          }}
        />
        <View style={styles.nextButton}>
          <Button
            title="Next"
            onPress={() => {
              dispatch(
                setPlan({
                  membership_id: activeId!,
                  assigned_location_api_id: agreeAll ? undefined : selectedLocation!,
                  all_locations: agreeAll,
                })
              );
              navigation.navigate(ROUTES.SIGNUP.INSERT_INFO);
            }}
            disabled={!canProceed}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray80,
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray20,
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray80,
    marginBottom: 8,
  },
  nextButton: {
    marginTop: 24,
  },
});
