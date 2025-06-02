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
import { useMemberships } from "../../hooks/useMemberships";
import { useLocations } from "../../hooks/useLocations";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.SELECT_PLAN>;

export interface LocationOption {
  label: string;
  value: string;
}

export default function SelectPlanScreen({ navigation }: Props) {
  const { data: memberships = [], isLoading: memLoading, isError: memError } = useMemberships();
  const { data: locations = [], isLoading: locLoading } = useLocations();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [agreeAll, setAgreeAll] = useState(false);

  //Initialize activeId when memberships first arrive
  useEffect(() => {
    if (!memLoading && memberships.length && activeId === null) {
      setActiveId(memberships[0].membership_id);
    }
  }, [memLoading, memberships, activeId]);

  if (memLoading || locLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  //  If there was an error fetching memberships, show a message
  if (memError) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: colors.error }}>Couldn’t load plans. Please try again.</Text>
      </View>
    );
  }

  if (memberships.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: colors.gray60 }}>No plans available right now.</Text>
      </View>
    );
  }

  const currentPlan = memberships.find((m) => m.membership_id === activeId) || memberships[0];

  const activeServices = currentPlan.services.map((s) => s.name);

  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc.Location_id,
  }));
  const canProceed = agreeAll || Boolean(selectedLocation);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Which plan suits you?</Text>

        <View style={styles.cardsRow}>
          {memberships.map((m) => (
            <MembershipCard key={m.membership_id} plan={m.plan} price={m.price} durationWash={m.duration_wash} active={m.membership_id === activeId} onPress={() => setActiveId(m.membership_id)} />
          ))}
        </View>

        <View style={styles.divider} />

        <AllServiceChips activeServices={activeServices} />

        <Text style={styles.sectionTitle}>Where do you want to wash?</Text>
        <Select label="Location" options={locationOptions} selectedValue={selectedLocation ?? ""} onValueChange={setSelectedLocation} placeholder={agreeAll ? "All locations" : "Select a location"} disabled={agreeAll} />

        <Checkbox
          label="Free access to all car washes with 10kr/month"
          checked={agreeAll}
          onChange={() => {
            const next = !agreeAll;
            setAgreeAll(next);
            if (next) {
              setSelectedLocation(null);
            }
          }}
        />

        <View style={styles.nextButton}>
          <Button
            title="Next"
            disabled={!canProceed}
            onPress={() => {
              navigation.navigate(ROUTES.SIGNUP.INSERT_INFO, {
                membership_id: activeId!,
                assigned_location_api_id: agreeAll ? undefined : selectedLocation!,
                all_locations: agreeAll,
              });
            }}
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
