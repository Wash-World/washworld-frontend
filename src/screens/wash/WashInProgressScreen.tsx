import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WashStackParamList } from "../../navigation/WashNavigator";
import { ROUTES } from "../../constants/routes";
import colors from "../../constants/colors";
import { useAppSelector } from "../../store";
import { LAN_IP } from "../../constants/env";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.IN_PROGRESS>;

export default function WashInProgressScreen({ route, navigation }: Props) {
  const user = useAppSelector((s) => s.auth.user);

  const token = useAppSelector((s) => s.auth.token);
  const { locationId, locationName, locationAddress, hallsCount, membershipId, durationWash } = route.params;

  // Convert minutes → seconds
  const initialSeconds = durationWash * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [started, setStarted] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const onStart = () => {
    setLoadingStart(true);

    // 1) POST to create a new washes_history on your NestJS backend
    fetch(`http://${LAN_IP}:3000/washes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        location_api_id: locationId,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((created: { wash_history_id: number }) => {
        setLoadingStart(false);
        setStarted(true);

        // 2) Kick off the fake countdown
        intervalRef.current = setInterval(() => {
          setSecondsLeft((s) => Math.max(s - 1, 0));
        }, 1000);

        // 3) After 10s, navigate to Feedback with the new history ID
        setTimeout(() => {
          clearInterval(intervalRef.current!);
          navigation.replace(ROUTES.WASH.FEEDBACK, {
            washHistoryId: created.wash_history_id,
            locationId,
          });
        }, 10_000);
      })
      .catch((err) => {
        console.error("Failed to start wash:", err);
        setLoadingStart(false);
        Alert.alert("Error", "Could not start wash. Please try again.");
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

  // Format mm:ss
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // Show loader while POSTing
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

      {/* Timer & Controls */}
      <View style={styles.body}>
        <Text style={styles.carIcon}>🚗</Text>
        <Text style={styles.timerText}>{`${mm}:${ss}`}</Text>

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
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  carIcon: { fontSize: 64, marginBottom: 16 },
  timerText: { fontSize: 48, fontWeight: "bold", color: colors.gray80 },
  startButton: {
    backgroundColor: colors.greenBrand,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  startText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  stopButton: {
    backgroundColor: colors.error,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  stopText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
