import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch } from "../../store";
import { setProfile } from "../../store/signupSlice";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import CarInputField from "../../components/signup/CarInputField";
import ProfileForm from "../../components/signup/ProfileForm";
import colors from "../../constants/colors";
import Button from "../../components/elements/Button";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.INSERT_INFO>;

export default function InsertInfoScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const { membership_id, assigned_location_api_id, all_locations } = route.params;

  // Car plate state
  const [plate, setPlate] = useState<string>("");
  const [plateError, setPlateError] = useState<string | undefined>(undefined);

  // Profile fields state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");

  // Toggle show/hide password
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Validation errors object
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  // Car-plate validation: exactly two uppercase letters, space, five digits
  const validatePlate = (): boolean => {
    const plateRegex = /^[A-Z]{2}\s\d{5}$/;
    if (!plateRegex.test(plate.trim())) {
      setPlateError("Car plate must be in format: DH 12345");
      return false;
    }
    setPlateError(undefined);
    return true;
  };

  // Profile validation: first/last nonempty, phone 6 digits, email format, password ≥6, confirm matches
  const validateProfile = (): boolean => {
    const errs: typeof errors = {};

    if (!firstName.trim()) {
      errs.firstName = "Insert a name";
    }
    if (!lastName.trim()) {
      errs.lastName = "Insert a last name";
    }

    if (!/^\d{6}$/.test(phone)) {
      errs.phone = "Use 6 digits (no country code)";
    }

    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      errs.email = "Email not valid";
    }

    if (password.length < 6) {
      errs.password = "Password too short (min 6 chars)";
    }

    if (confirm !== password) {
      errs.confirm = "Passwords don’t match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Enable “Next” only if all fields are syntactically valid
  const canProceed =
    /^[A-Z]{2}\s\d{5}$/.test(plate.trim()) &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    /^\d{6}$/.test(phone) && // changed from \d{8} to \d{6}
    /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email) &&
    password.length >= 6 &&
    confirm === password;

  // On pressing Next: re-validate plate + profile, dispatch to Redux, then navigate
  const handleNext = () => {
    const plateOk = validatePlate();
    const profileOk = validateProfile();
    if (!plateOk || !profileOk) {
      return;
    }

    // Dispatch profile data into Redux (use "name" for firstName to match backend)
    dispatch(
      setProfile({
        name: firstName.trim(),
        lastname: lastName.trim(),
        email: email.trim(),
        password,
        mobile_num: phone,
        carplate: plate.trim(),
      })
    );

    navigation.navigate(ROUTES.SIGNUP.PAYMENT);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Insert your info</Text>

        <CarInputField
          placeholder="Car plate (e.g. DH 12345)"
          value={plate}
          onChangeText={(t) => {
            const upper = t.toUpperCase();
            setPlate(upper);
            if (plateError) {
              setPlateError(undefined);
            }
          }}
          onBlur={() => {
            validatePlate();
          }}
          error={plateError}
        />

        <ProfileForm
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          email={email}
          password={password}
          confirm={confirm}
          showPwd={showPwd}
          showConfirm={showConfirm}
          errors={errors}
          onChangeFirstName={(t) => {
            setFirstName(t);
            if (errors.firstName) {
              setErrors((prev) => {
                const { firstName: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurFirstName={() => {
            if (!firstName.trim()) {
              setErrors((prev) => ({ ...prev, firstName: "Insert a name" }));
            } else {
              setErrors((prev) => {
                const { firstName: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onChangeLastName={(t) => {
            setLastName(t);
            if (errors.lastName) {
              setErrors((prev) => {
                const { lastName: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurLastName={() => {
            if (!lastName.trim()) {
              setErrors((prev) => ({ ...prev, lastName: "Insert a last name" }));
            } else {
              setErrors((prev) => {
                const { lastName: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onChangePhone={(t) => {
            setPhone(t);
            if (errors.phone) {
              setErrors((prev) => {
                const { phone: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurPhone={() => {
            if (!/^\d{6}$/.test(phone)) {
              setErrors((prev) => ({ ...prev, phone: "Use 6 digits (no country code)" }));
            } else {
              setErrors((prev) => {
                const { phone: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onChangeEmail={(t) => {
            setEmail(t);
            if (errors.email) {
              setErrors((prev) => {
                const { email: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurEmail={() => {
            if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
              setErrors((prev) => ({ ...prev, email: "Email not valid" }));
            } else {
              setErrors((prev) => {
                const { email: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onChangePassword={(t) => {
            setPassword(t);
            if (errors.password) {
              setErrors((prev) => {
                const { password: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurPassword={() => {
            if (password.length < 6) {
              setErrors((prev) => ({ ...prev, password: "Password too short (min 6 chars)" }));
            } else {
              setErrors((prev) => {
                const { password: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onChangeConfirm={(t) => {
            setConfirm(t);
            if (errors.confirm) {
              setErrors((prev) => {
                const { confirm: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onBlurConfirm={() => {
            if (confirm !== password) {
              setErrors((prev) => ({ ...prev, confirm: "Passwords don’t match" }));
            } else {
              setErrors((prev) => {
                const { confirm: _, ...rest } = prev;
                return rest;
              });
            }
          }}
          onToggleShowPwd={() => setShowPwd((v) => !v)}
          onToggleShowConfirm={() => setShowConfirm((v) => !v)}
          passwordIcon={<Ionicons name={showPwd ? "eye" : "eye-off"} size={20} color={colors.gray40} />}
          confirmIcon={<Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color={colors.gray40} />}
        />

        <View style={styles.buttonWrapper}>
          <Button title="Next" onPress={handleNext} disabled={!canProceed} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.gray80,
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 24,
  },
});
