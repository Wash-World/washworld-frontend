// src/screens/wash/FeedbackDetailsScreen.tsx

import React, { useState } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import FeedbackInput from "../../components/wash/FeedbackInput";
import colors from "../../constants/colors";
import { LAN_IP } from "../../constants/env";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.FEEDBACK_DETAILS>;

export default function FeedbackDetailsScreen({ route, navigation }: Props) {
  const { feedbackId, locationName, locationAddress } = route.params;
  const token = useAppSelector((s) => s.auth.token);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const onSendFeedback = async () => {
    if (!text.trim()) {
      return Alert.alert("Feedback required", "Please tell us what went wrong.");
    }
    setLoading(true);

    try {
      // PATCH the feedback record with only the comment
      const res = await fetch(`http://${LAN_IP}:3000/feedbacks/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: text }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }

      setLoading(false);
      navigation.replace(ROUTES.WASH.THANK_YOU);
    } catch (err: any) {
      console.error("FeedbackDetails error:", err);
      setLoading(false);
      Alert.alert("Error", "Could not send feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header bar */}
      <View style={styles.header}>
        <ScrollView contentContainerStyle={styles.content}>
          <FeedbackInput text={text} onChangeText={setText} onSendFeedback={onSendFeedback} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.gray05,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.gray80,
    lineHeight: 20,
    marginBottom: 24,
  },
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
