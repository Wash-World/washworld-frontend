import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import CarInputField from "../../components/signup/CarInputField";
import ProfileForm, { ProfileFormProps } from "../../components/signup/ProfileForm";
import colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  updateField,
  setValidationErrors,
  setPlan,
  setProfile,
} from "../../store/signupSlice";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.INSERT_INFO>;

export default function InsertInfoScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
 // 1️⃣ Select values and errors from Redux
  const { profile, validationErrors } = useAppSelector((state) => state.signup);
  const plate = profile?.carplate ?? "";
  const plateError = validationErrors.carplate;

  // Icons for password fields
  // (ProfileForm will handle reading password & confirm fom profile...)
  const pwdIcon = <Ionicons name="eye" size={20} color={colors.gray40} />;

  // 2️⃣ Handler: update plate field on change
  const onChangePlate = (text: string) => {
    dispatch(updateField({ field: "carplate", value: text }));
  };

  // 3️⃣ Next button validation & submit
  const handleNext = () => {
    // TODO: pull full profile, run validators, collect `errors: Partial<Record<...>>`
    // dispatch(setValidationErrors(errors));
    // if (Object.keys(errors).length === 0) {
    //   dispatch(setProfile(profile));  // if you still need bulk set
    //   navigation.navigate(ROUTES.SIGNUP.PAYMENT);
    // }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insert your info</Text>

      {/* 4️⃣ Wire CarInputField to Redux */}
      <CarInputField
        placeholder="Car plate number"
        value={plate}
        onChangeText={onChangePlate}
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
        onChangeFirstName={setFirstName}
        onChangeLastName={setLastName}
        onChangePhone={setPhone}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeConfirm={setConfirm}
        onToggleShowPwd={() => setShowPwd((v) => !v)}
        onToggleShowConfirm={() => setShowConfirm((v) => !v)}
        passwordIcon={passwordIcon}
        confirmIcon={confirmIcon}
        onNext={function (): void {
          throw new Error("Function not implemented.");
        }} // NOTE: no onNext prop here—ProfileForm will render fields only
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Next"
          // always call handleNext, without disabled or validation guard
          onPress={() => {
            // skip validation for now:
            dispatch(
              setProfile({
                name: firstName,
                lastname: lastName,
                email,
                password,
                mobile_num: phone,
                carplate: plate,
              })
            );
            navigation.navigate(ROUTES.SIGNUP.PAYMENT);
          }}
          disabled={false}
        />
      </View>
    </ScrollView>
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
