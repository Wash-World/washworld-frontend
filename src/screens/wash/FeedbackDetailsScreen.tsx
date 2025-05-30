import React, { useState } from "react";
import { View, Alert, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import FeedbackInput from "../../components/wash/FeedbackInput";
import colors from "../../constants/colors";
import { usePatchFeedback } from "../../hooks/useFeedback";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.FEEDBACK_DETAILS>;

export default function FeedbackDetailsScreen({ route, navigation }: Props) {
  const { feedbackId } = route.params;
  const [text, setText] = useState("");
  const { mutateAsync: patchFeedback, isLoading } = usePatchFeedback();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
      </View>
    );
  }

  const onSendFeedback = async () => {
    if (!text.trim()) {
      return Alert.alert("Feedback required", "Please tell us what went wrong.");
    }
    try {
      await patchFeedback({ feedbackId, comment: text });
      navigation.replace(ROUTES.WASH.THANK_YOU);
    } catch (err: any) {
      console.error("Patch feedback error:", err);
      Alert.alert("Error", "Could not send feedback. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <FeedbackInput text={text} onChangeText={setText} onSendFeedback={onSendFeedback} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, paddingBottom: 100 },
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
