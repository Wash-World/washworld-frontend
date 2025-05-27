// src/screens/signup/CardPaymentScreen.tsx
import React, { useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../store";
import { setPayment, submitSignup, resetSignup } from "../../store/signupSlice";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import Payment from "../../components/signup/Payment";
import Button from "../../components/elements/Button";
import colors from "../../constants/colors";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.PAYMENT>;

export default function CardPaymentScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.signup);

  // 1) Local form state + errors
  const [owner, setOwner] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{
    owner?: string;
    number?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  // 2) Validation logic (unchanged)
  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!owner.trim()) errs.owner = "Insert a valid name";
    if (!/^\d{16}$/.test(number)) errs.number = "Use 16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errs.expiry = "Use MM/YY";
    else {
      const [mm, yy] = expiry.split("/").map((s) => parseInt(s, 10));
      if (new Date(2000 + yy, mm) <= new Date()) errs.expiry = "Card expired";
    }
    if (!/^\d{3,4}$/.test(cvv)) errs.cvv = "3 or 4 digit code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 3) Handler that dispatches payment + submitSignup
  const handlePay = async () => {
    if (!validate()) return;

    // 3a) Save payment details
    dispatch(
      setPayment({
        card_owner: owner,
        card_number: number,
        expiry_date: expiry,
        cvv,
      })
    );

    try {
      // 3b) Call the thunk and wait for it to complete
      await dispatch(submitSignup()).unwrap();

      // 3c) On success, clear slice and go to ThankYou
      dispatch(resetSignup());
      navigation.navigate(ROUTES.SIGNUP.THANK_YOU);
    } catch (err: any) {
      Alert.alert("Signup failed", err.message || "Please try again");
    }
  };

  // allow button only if fields nonempty
  const canProceed = owner.trim() !== "" && number.trim() !== "" && expiry.trim() !== "" && cvv.trim() !== "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Payment owner={owner} onChangeOwner={setOwner} number={number} onChangeNumber={(t) => setNumber(t.replace(/\D/g, ""))} expiry={expiry} onChangeExpiry={setExpiry} cvv={cvv} onChangeCvv={setCvv} errors={errors} />

        {status === "pending" && <ActivityIndicator size="large" color={colors.greenBrand} style={{ marginVertical: 16 }} />}

        <View style={styles.buttonWrapper}>
          <Button title={status === "pending" ? "Processing…" : "Pay"} onPress={handlePay} disabled={!canProceed || status === "pending"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
