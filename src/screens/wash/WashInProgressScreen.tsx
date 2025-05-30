// src/screens/wash/WashInProgressScreen.tsx

import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";
import { useStartWash } from "../../hooks/useStartWash";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.IN_PROGRESS>;

export default function WashInProgressScreen({ route, navigation }: Props) {
  // ① pull user + carplate from Redux
  const user = useAppSelector((s) => s.auth.user);
  // ② destructure the values passed in from SelectWashScreen
  const { locationName, locationAddress, washPlan, durationWash } = route.params;

  // convert minutes → seconds
  const initialSeconds = durationWash * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // ③ our mutation hook
  const { mutateAsync: startWash, isLoading: isStarting } = useStartWash();

  const onStart = async () => {
    try {
      // POST & get back wash_history_id
      const { wash_history_id } = await startWash({
        user_id: user.id,
        location_api_id: route.params.locationId,
      });

      // mark started
      setStarted(true);

      // begin countdown
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);

      // after 10s, go to feedback
      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        navigation.replace(ROUTES.WASH.FEEDBACK, {
          washHistoryId: wash_history_id,
          locationId: route.params.locationId,
        });
      }, 10_000);
    } catch (err) {
      console.error("Start wash failed:", err);
      Alert.alert("Error", "Could not start wash. Please try again.");
    }
  };

  const onStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      Alert.alert("Emergency stop", "Wash stopped.");
      setStarted(false);
      setSecondsLeft(initialSeconds);
    }
  };

  // format mm:ss
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // while we're POSTing
  if (isStarting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.locationName}>{locationName}</Text>
        <Text style={styles.locationAddress}>{locationAddress}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Car Plate</Text>
          <Text style={styles.value}>{user.carplate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vaskehøll</Text>
          <Text style={styles.value}>#{route.params.locationId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wash</Text>
          <Text style={styles.value}>{washPlan}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Extra Services</Text>
          <Text style={styles.value}>None</Text>
        </View>
      </View>

      {/* Car + Timer */}
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
    </SafeAreaView>
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

  summary: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  summaryTitle: {
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
  value: { fontSize: 16, fontWeight: "600", color: colors.gray80 },

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
