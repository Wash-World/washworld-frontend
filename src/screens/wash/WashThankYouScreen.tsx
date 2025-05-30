import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../../constants/colors";
import { ROUTES } from "../../constants/routes";
import { WashStackParamList } from "../../navigation/WashNavigator";

type Props = NativeStackScreenProps<WashStackParamList, typeof ROUTES.WASH.THANK_YOU>;

export default function WashThankYouScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.getParent()?.navigate(ROUTES.HOME);
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Thank you! 🎉</Text>
      <Text style={styles.subtitle}>We appreciate your feedback. Returning you to Home in a moment…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray60,
    textAlign: "center",
  },
});
