// src/screens/signup/CardPaymentScreen.tsx
import React from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import Payment from "../../components/signup/Payment";
import Button from "../../components/elements/Button";
import colors from "../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  updatePaymentField,
  setValidationErrors,
  submitSignup,
  resetSignup,
} from "../../store/signupSlice";
import { validatePayment } from "../../utils/validators";

type Props = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.PAYMENT
>;

export default function CardPaymentScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { payment, validationErrors, status } = useAppSelector((st) => st.signup);

  // Safely extract fields or default to empty strings
  const owner = payment?.card_owner ?? "";
  const number = payment?.card_number ?? "";
  const expiry = payment?.expiry_date ?? "";
  const cv = payment?.cvv ?? "";

  // Dispatch helpers
  const upd = (field: keyof typeof payment) => (text: string) =>
    dispatch(updatePaymentField({ field, value: text }));

  // On “Pay”: validate, set errors, then submit if no errors
  const handlePay = async () => {
    const errs = validatePayment({ card_owner: owner, card_number: number, expiry_date: expiry, cvv: cv });
    dispatch(setValidationErrors(errs));
    if (Object.keys(errs).length === 0) {
      try {
        await dispatch(submitSignup()).unwrap();
        dispatch(resetSignup());
        navigation.navigate(ROUTES.SIGNUP.THANK_YOU);
      } catch (e: any) {
        Alert.alert("Signup failed", e.message || "Please try again");
      }
    }
  };

  // Enable button only if all fields nonempty
  const canProceed = !!owner && !!number && !!expiry && !!cv;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Payment
          owner={owner}
          onChangeOwner={upd("card_owner")}
          number={number}
          onChangeNumber={(t) => upd("card_number")(t.replace(/\D/g, ""))}
          expiry={expiry}
          onChangeExpiry={upd("expiry_date")}
          cvv={cv}
          onChangeCvv={upd("cvv")}
          errors={{
            owner: validationErrors.card_owner,
            number: validationErrors.card_number,
            expiry: validationErrors.expiry_date,
            cvv: validationErrors.cvv,
          }}
        />
        {status === "pending" && (
          <ActivityIndicator size="large" color={colors.greenBrand} style={styles.loader} />
        )}
        <View style={styles.buttonWrapper}>
          <Button
            title={status === "pending" ? "Processing…" : "Pay"}
            onPress={handlePay}
            disabled={!canProceed || status === "pending"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 20 },
  loader: { marginVertical: 16 },
  buttonWrapper: { marginTop: 24 },
});

