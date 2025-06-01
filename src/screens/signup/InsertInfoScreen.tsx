// src/screens/signup/InsertInfoScreen.tsx

import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import CarInputField from "../../components/signup/CarInputField";
import ProfileForm from "../../components/signup/ProfileForm";
import colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../../store";
import { updateProfileField, setValidationErrors } from "../../store/signupSlice";
import { validateProfile } from "../../utils/validators";

type Props = NativeStackScreenProps<
  SignUpStackParamList,
  typeof ROUTES.SIGNUP.INSERT_INFO
>;

export default function InsertInfoScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();

  // 1️⃣ Pull `profile` and `validationErrors` from Redux store
  const { profile, validationErrors } = useAppSelector((st) => st.signup);

  // Destructure fields from `profile` for easier access
  const {
    name,
    lastname,
    mobile_num,
    email,
    password,
    confirm,
    carplate,
  } = profile;

  // Local state to toggle password visibility (eye / eye-off icons)
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2️⃣ Helper function to dispatch profile updates in a concise way
  //    `upd("email")("newEmail")` will call updateProfileField({ field: "email", value: "newEmail" })
  const upd = (field: keyof typeof profile) => (text: string) =>
    dispatch(updateProfileField({ field, value: text }));

  // 3️⃣ When the Next button is pressed, validate the entire profile
  const handleNext = () => {
    // Run shared validator on every field, including carplate
    const errors = validateProfile({
      name,
      lastname,
      mobile_num,
      email,
      password,
      confirm,
      carplate,
    });

    // Store any validation errors into Redux so fields can show them
    dispatch(setValidationErrors(errors));

    // If there are no errors (keys length is zero), navigate to the payment screen
    if (Object.keys(errors).length === 0) {
      navigation.navigate(ROUTES.SIGNUP.PAYMENT);
    }
  };

  // 4️⃣ Determine if the Next button should be enabled (all required fields nonempty + passwords match)
  const canProceed =
    !!carplate.trim() &&
    !!name.trim() &&
    !!lastname.trim() &&
    !!mobile_num.trim() &&
    !!email.trim() &&
    password.length >= 6 &&
    confirm === password;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Insert your info</Text>

      {/* Car plate input field */}
      <CarInputField
        placeholder="Car plate number"
        value={carplate}
        onChangeText={upd("carplate")}          // Dispatch updateProfileField("carplate", newText)
        error={validationErrors.carplate}       // Show carplate-specific error if present
      />

      {/* ProfileForm: renders name, lastname, phone, email, password, confirm */}
      <ProfileForm
        firstName={name}
        lastName={lastname}
        phone={mobile_num}
        email={email}
        password={password}
        confirm={confirm}
        showPwd={showPwd}                       // Toggle visibility of password field
        showConfirm={showConfirm}               // Toggle visibility of confirm field
        errors={{
          firstName: validationErrors.name,     // Pass down any validation error per field
          lastName: validationErrors.lastname,
          phone: validationErrors.mobile_num,
          email: validationErrors.email,
          password: validationErrors.password,
          confirm: validationErrors.confirm,
        }}
        onChangeFirstName={upd("name")}         // Dispatch updateProfileField("name", text)
        onChangeLastName={upd("lastname")}
        onChangePhone={upd("mobile_num")}
        onChangeEmail={upd("email")}
        onChangePassword={upd("password")}
        onChangeConfirm={upd("confirm")}
        onToggleShowPwd={() => setShowPwd((prev) => !prev)}        // Flip showPwd boolean
        onToggleShowConfirm={() => setShowConfirm((prev) => !prev)} // Flip showConfirm boolean
        passwordIcon={
          // Icon changes based on showPwd
          <Ionicons
            name={showPwd ? "eye" : "eye-off"}
            size={20}
            color={colors.gray40}
          />
        }
        confirmIcon={
          // Icon changes based on showConfirm
          <Ionicons
            name={showConfirm ? "eye" : "eye-off"}
            size={20}
            color={colors.gray40}
          />
        }
         onNext={function (): void {
          throw new Error("Function not implemented.");
        }} // NOTE: no onNext prop here—ProfileForm will render fields only

      />

      {/* Next button */}
      <View style={styles.buttonWrapper}>
        <Button
          title="Next"
          onPress={handleNext}      // Calls validation + navigation if valid
          disabled={!canProceed}    // Disabled until all fields are filled & passwords match
        />
      </View>
    </ScrollView>
  );
}

// Styles for layout and typography
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
