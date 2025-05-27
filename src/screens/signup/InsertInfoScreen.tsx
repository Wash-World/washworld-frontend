import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SignUpStackParamList } from "../../navigation/SignUpNavigator";
import { ROUTES } from "../../constants/routes";
import CarInputField from "../../components/signup/CarInputField";
import ProfileForm, { ProfileFormProps } from "../../components/signup/ProfileForm";
import colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch } from "../../store";
import { setProfile } from "../../store/signupSlice";

type Props = NativeStackScreenProps<SignUpStackParamList, typeof ROUTES.SIGNUP.INSERT_INFO>;

export default function InsertInfoScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  // Plate state + validation
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState<string | undefined>(undefined);

  const validatePlate = (): boolean => {
    if (!plate.trim()) {
      setPlateError("Plate number cannot be empty");
      return false;
    }
    setPlateError(undefined);
    return true;
  };

  // Profile state + validation
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<ProfileFormProps["errors"]>({});

  const validateProfile = (): boolean => {
    const errs: ProfileFormProps["errors"] = {};
    if (!firstName.trim()) errs.firstName = "Insert a name";
    if (!lastName.trim()) errs.lastName = "Insert a last name";
    if (!/^\+\d{2}\s?\d{6,}$/.test(phone)) errs.phone = "Insert a valid phone number";
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) errs.email = "Email not valid";
    if (password.length < 4) errs.password = "Password too short. Choose at least 6 characters.";
    if (confirm !== password) errs.confirm = "Passwords don’t match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Icons for password fields
  const passwordIcon = <Ionicons name={showPwd ? "eye" : "eye-off"} size={20} color={colors.gray40} />;
  const confirmIcon = <Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color={colors.gray40} />;

  const handleNext = () => {
    const okPlate = validatePlate();
    const okProfile = validateProfile();
    if (!okPlate || !okProfile) return;

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
  };

  // Control button enabled state
  const canProceed = plate.trim().length > 0 && firstName.trim().length > 0 && lastName.trim().length > 0 && /^\+\d{2}\s?\d{6,}$/.test(phone) && /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email) && password.length >= 6 && confirm === password;

  function onNext(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insert your info</Text>

      <CarInputField
        placeholder="Car plate number"
        value={plate}
        onChangeText={(t) => {
          setPlate(t);
          if (plateError) setPlateError(undefined);
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
