import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import InputField from "../elements/InputField";
import colors from "../../constants/colors";

export interface ProfileFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
  showPwd: boolean;
  showConfirm: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirm?: string;
  };
  onChangeFirstName: (text: string) => void;
  onChangeLastName: (text: string) => void;
  onChangePhone: (text: string) => void;
  onChangeEmail: (text: string) => void;
  onChangePassword: (text: string) => void;
  onChangeConfirm: (text: string) => void;
  onToggleShowPwd: () => void;
  onToggleShowConfirm: () => void;
  onBlurFirstName: () => void;
  onBlurLastName: () => void;
  onBlurPhone: () => void;
  onBlurEmail: () => void;
  onBlurPassword: () => void;
  onBlurConfirm: () => void;
  passwordIcon: React.ReactNode;
  confirmIcon: React.ReactNode;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ firstName, lastName, phone, email, password, confirm, showPwd, showConfirm, errors, onChangeFirstName, onChangeLastName, onChangePhone, onChangeEmail, onChangePassword, onChangeConfirm, onToggleShowPwd, onToggleShowConfirm, onBlurFirstName, onBlurLastName, onBlurPhone, onBlurEmail, onBlurPassword, onBlurConfirm, passwordIcon, confirmIcon }) => (
  <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Text style={styles.heading}>Your profile</Text>

    <View style={styles.row}>
      <View style={styles.half}>
        <InputField label="Name" placeholder="John" value={firstName} onChangeText={onChangeFirstName} onBlur={onBlurFirstName} error={errors.firstName} />
      </View>
      <View style={styles.half}>
        <InputField label="Last name" placeholder="Doe" value={lastName} onChangeText={onChangeLastName} onBlur={onBlurLastName} error={errors.lastName} />
      </View>
    </View>

    <InputField label="Mobile Number" placeholder="12345678" keyboardType="phone-pad" value={phone} onChangeText={onChangePhone} onBlur={onBlurPhone} error={errors.phone} />

    <InputField label="Email" placeholder="johndoe@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={onChangeEmail} onBlur={onBlurEmail} error={errors.email} />

    <InputField label="Password" placeholder="******" secureTextEntry={!showPwd} value={password} onChangeText={onChangePassword} onBlur={onBlurPassword} icon={passwordIcon} onIconPress={onToggleShowPwd} error={errors.password} />

    <InputField label="Confirm password" placeholder="******" secureTextEntry={!showConfirm} value={confirm} onChangeText={onChangeConfirm} onBlur={onBlurConfirm} icon={confirmIcon} onIconPress={onToggleShowConfirm} error={errors.confirm} />
  </ScrollView>
);

export default ProfileForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.gray80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 1,
    marginRight: 8,
  },
});
