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

  // payment inputs
  const [owner, setOwner] = useState<string>("");
  const [number, setNumber] = useState<string>(""); // can include spaces
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  //validation errors object
  const [errors, setErrors] = useState<{
    owner?: string;
    number?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  //vallidation logic
  const validateAll = (): boolean => {
    const newErrors: typeof errors = {};

    if (!/^[A-Za-z]+(?: [A-Za-z]+)+$/.test(owner.trim())) {
      newErrors.owner = "Enter first and last name";
    }

    const digitsOnly = number.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(digitsOnly)) {
      newErrors.number = "Use 16 digits";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Use format MM/YY";
    } else {
      const [mmStr, yyStr] = expiry.split("/");
      const mm = parseInt(mmStr, 10);
      const yy = parseInt(yyStr, 10);
      // Create a Date for the last day of that month at 23:59:59
      const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
      if (expDate < new Date()) {
        newErrors.expiry = "Card expired";
      }
    }

    if (!/^\d{3,4}$/.test(cvv.trim())) {
      newErrors.cvv = "3 or 4 digit code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // onBlur handlers for each field
  const onBlurOwner = () => {
    if (!/^[A-Za-z]+(?: [A-Za-z]+)+$/.test(owner.trim())) {
      setErrors((prev) => ({ ...prev, owner: "Enter first and last name" }));
    } else {
      setErrors((prev) => {
        const { owner: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const onBlurNumber = () => {
    const digitsOnly = number.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(digitsOnly)) {
      setErrors((prev) => ({ ...prev, number: "Use 16 digits" }));
    } else {
      setErrors((prev) => {
        const { number: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const onBlurExpiry = () => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setErrors((prev) => ({ ...prev, expiry: "Use format MM/YY" }));
    } else {
      const [mmStr, yyStr] = expiry.split("/");
      const mm = parseInt(mmStr, 10);
      const yy = parseInt(yyStr, 10);
      const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
      if (expDate < new Date()) {
        setErrors((prev) => ({ ...prev, expiry: "Card expired" }));
      } else {
        setErrors((prev) => {
          const { expiry: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const onBlurCvv = () => {
    if (!/^\d{3,4}$/.test(cvv.trim())) {
      setErrors((prev) => ({ ...prev, cvv: "3 or 4 digit code" }));
    } else {
      setErrors((prev) => {
        const { cvv: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const canProceed = owner.trim().length > 0 && number.replace(/\s+/g, "").length === 16 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) && cvv.trim().length > 0;

  const handlePay = async () => {
    if (!validateAll()) {
      return;
    }

    // dispatch payment info into Redux
    dispatch(
      setPayment({
        card_owner: owner.trim(),
        card_number: number.replace(/\s+/g, ""),
        expiry_date: expiry,
        cvv: cvv.trim(),
      })
    );

    try {
      await dispatch(submitSignup()).unwrap();
      dispatch(resetSignup());
      navigation.navigate(ROUTES.SIGNUP.THANK_YOU);
    } catch (err: any) {
      Alert.alert("Signup failed", err.message || "Please try again");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Payment
          owner={owner}
          onChangeOwner={(text) => {
            setOwner(text);
            if (errors.owner) {
              setErrors((prev) => {
                const { owner: _o, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurOwner={onBlurOwner}
          number={number}
          onChangeNumber={(text) => {
            // Allow spaces or digits; we only strip spaces in validation
            setNumber(text);
            if (errors.number) {
              setErrors((prev) => {
                const { number: _n, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurNumber={onBlurNumber}
          expiry={expiry}
          onChangeExpiry={(text) => {
            setExpiry(text);
            if (errors.expiry) {
              setErrors((prev) => {
                const { expiry: _e, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurExpiry={onBlurExpiry}
          cvv={cvv}
          onChangeCvv={(text) => {
            setCvv(text);
            if (errors.cvv) {
              setErrors((prev) => {
                const { cvv: _c, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurCvv={onBlurCvv}
          errors={errors}
        />

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
