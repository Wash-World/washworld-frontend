// src/screens/wash/WashFeedbackScreen.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";
import { LAN_IP } from "../../constants/env";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.FEEDBACK>;

export default function WashFeedbackScreen({ route, navigation }: Props) {
  const { washHistoryId } = route.params;
  const token = useAppSelector((s) => s.auth.token);

  const [loading, setLoading] = useState(false);

  // helper to send feedback and navigate
  const send = async (rating: number, comment: string, nextRoute: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://${LAN_IP}:3000/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wash_history_id: washHistoryId,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }
      const created = await res.json(); // { feedback_id, ... }
      setLoading(false);

      if (nextRoute === ROUTES.WASH.THANK_YOU) {
        navigation.replace(ROUTES.WASH.THANK_YOU);
      } else {
        // pass feedbackId to details screen
        navigation.replace(ROUTES.WASH.FEEDBACK_DETAILS, {
          feedbackId: created.feedback_id,
        });
      }
    } catch (err: any) {
      console.error("Feedback error:", err);
      setLoading(false);
      Alert.alert("Error", "Could not send feedback. Please try again.");
    }
  };

  // Configuration for each option
  const options = [
    {
      title: "Great",
      description: "The wash was thorough, quick, and my car looks spotless.",
      icon: "check-circle" as const,
      color: colors.greenBrand,
      rating: 5,
      comment: "Great wash!",
      next: ROUTES.WASH.THANK_YOU,
    },
    {
      title: "Okay",
      description: "The wash was decent, but I noticed some missed spots or small issues.",
      icon: "error-outline" as const,
      color: colors.orange,
      rating: 3,
      comment: "It was okay.",
      next: ROUTES.WASH.FEEDBACK_DETAILS,
    },
    {
      title: "Not Good",
      description: "The wash didn’t meet my expectations. I had a problem or something didn’t work properly.",
      icon: "highlight-off" as const,
      color: colors.error,
      rating: 1,
      comment: "Not good.",
      next: ROUTES.WASH.FEEDBACK_DETAILS,
    },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>How was your wash?</Text>
      <Text style={styles.subheader}>We’d love to hear your feedback. Tell us how it went — your feedback helps us improve.</Text>

      {options.map((opt) => (
        <TouchableOpacity key={opt.title} style={[styles.card, { borderColor: opt.color }]} activeOpacity={0.8} onPress={() => send(opt.rating, opt.comment, opt.next)}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: opt.color }]}>{opt.title}</Text>
            <MaterialIcons name={opt.icon} size={24} color={opt.color} />
          </View>
          <Text style={styles.description}>{opt.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 14,
    color: colors.gray80,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: colors.gray80,
  },
});
