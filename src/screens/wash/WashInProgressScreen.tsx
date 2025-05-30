// src/screens/wash/WashInProgressScreen.tsx

import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WashStackParamList } from "../../navigation/WashNavigator";
import { ROUTES } from "../../constants/routes";
import colors from "../../constants/colors";
import { useAppSelector } from "../../store";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.IN_PROGRESS>;

export default function WashInProgressScreen({ route, navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const { locationId, locationName, locationAddress, hallsCount, membershipId, durationWash } = route.params;

  const initialSeconds = durationWash * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [started, setStarted] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const onStart = () => {
    setLoadingStart(true);

    fetch("https://washworld.dk/wp-json/ww/v1/washSessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        optionId: membershipId,
        userId: user.id,
        locationId,
      }),
    })
      .then((res) => res.json())
      .then((session: { id: number }) => {
        setLoadingStart(false);
        setStarted(true);

        // Start countdown
        intervalRef.current = setInterval(() => {
          setSecondsLeft((s) => Math.max(s - 1, 0));
        }, 1000);

        // After 10s go to feedback
        setTimeout(() => {
          clearInterval(intervalRef.current!);
          navigation.replace(ROUTES.WASH.FEEDBACK, {
            washHistoryId: session.id,
            locationId,
          });
        }, 10_000);
      })
      .catch((err) => {
        console.error(err);
        setLoadingStart(false);
        Alert.alert("Error", "Could not start wash. Try again.");
      });
  };

  const onStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      Alert.alert("Emergency stop", "Wash stopped.");
      setStarted(false);
      setSecondsLeft(initialSeconds);
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (loadingStart) {
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

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Vaskehøll</Text>
          <Text style={styles.value}>#{locationId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wash</Text>
          <Text style={styles.value}>{durationWash} min</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Extra Services</Text>
          <Text style={styles.value}>None</Text>
        </View>
      </View>

      {/* Car & timer */}
      <View style={styles.body}>
        <Text style={styles.carIcon}>🚗</Text>
        <Text style={styles.timerText}>{`${mm}:${ss}`}</Text>
      </View>

      {/* Button */}
      {!started ? (
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.startText}>START WASH</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={onStop} activeOpacity={0.8}>
          <Text style={styles.stopText}>EMERGENCY STOP</Text>
        </TouchableOpacity>
      )}
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: { fontSize: 14, color: colors.gray60 },
  value: { fontSize: 16, color: colors.gray80, fontWeight: "600" },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carIcon: { fontSize: 64, marginBottom: 16 },
  timerText: { fontSize: 48, fontWeight: "bold", color: colors.gray80 },
  startButton: {
    backgroundColor: colors.greenBrand,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  startText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  stopButton: {
    backgroundColor: colors.error,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  stopText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
