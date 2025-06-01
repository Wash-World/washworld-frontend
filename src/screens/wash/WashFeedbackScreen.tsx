import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";
import colors from "../../constants/colors";
import { usePostFeedback } from "../../hooks/useFeedback";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.FEEDBACK>;

export default function WashFeedbackScreen({ route, navigation }: Props) {
  const { washHistoryId } = route.params;
  const { mutateAsync: postFeedback } = usePostFeedback();

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

  const onSelect = async (rating: number, comment: string, nextRoute: typeof ROUTES.WASH.THANK_YOU | typeof ROUTES.WASH.FEEDBACK_DETAILS) => {
    try {
      const { feedback_id } = await postFeedback({
        //here i call the mutation function of tanstack
        wash_history_id: washHistoryId,
        rating,
        comment,
      });

      if (nextRoute === ROUTES.WASH.FEEDBACK_DETAILS) {
        navigation.replace(nextRoute, { feedbackId: feedback_id });
      } else {
        navigation.replace(nextRoute);
      }
    } catch (err: any) {
      console.error("Feedback error:", err);
      Alert.alert("Error", "Could not send feedback. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>How was your wash?</Text>
        <Text style={styles.subheader}>We’d love to hear your feedback. Tell us how it went — your feedback helps us improve.</Text>

        {options.map((opt) => (
          <TouchableOpacity key={opt.title} style={[styles.card, { borderColor: opt.color }]} activeOpacity={0.8} onPress={() => onSelect(opt.rating, opt.comment, opt.next)}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: opt.color }]}>{opt.title}</Text>
              <MaterialIcons name={opt.icon} size={24} color={opt.color} />
            </View>
            <Text style={styles.description}>{opt.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  center: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  container: { padding: 16 },
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
