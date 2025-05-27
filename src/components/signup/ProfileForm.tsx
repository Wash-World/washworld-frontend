import React, { ReactNode } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  onNext: () => void;
  passwordIcon: ReactNode;
  confirmIcon: ReactNode;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ firstName, lastName, phone, email, password, confirm, showPwd, showConfirm, errors, onChangeFirstName, onChangeLastName, onChangePhone, onChangeEmail, onChangePassword, onChangeConfirm, onToggleShowPwd, onToggleShowConfirm, onNext, passwordIcon, confirmIcon }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.heading}>Your profile</Text>

    <View style={styles.row}>
      <View style={styles.half}>
        <InputField label="Name" placeholder="John" value={firstName} onChangeText={onChangeFirstName} error={errors.firstName} />
      </View>
      <View style={styles.half}>
        <InputField label="Last name" placeholder="Doe" value={lastName} onChangeText={onChangeLastName} error={errors.lastName} />
      </View>
    </View>

    <InputField label="Mobile Number" placeholder="+45 123456789" value={phone} onChangeText={onChangePhone} error={errors.phone} />

    <InputField label="Email" placeholder="johndoe@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={onChangeEmail} error={errors.email} />

    <InputField label="Password" placeholder="******" secureTextEntry={!showPwd} value={password} onChangeText={onChangePassword} icon={passwordIcon} onIconPress={onToggleShowPwd} error={errors.password} />

    <InputField label="Confirm password" placeholder="******" secureTextEntry={!showConfirm} value={confirm} onChangeText={onChangeConfirm} icon={confirmIcon} onIconPress={onToggleShowConfirm} error={errors.confirm} />
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
  nextBtn: {
    marginTop: 24,
    backgroundColor: colors.greenBrand,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

//how to use it
// export default function App() {
//   // 1) State hooks for each field and error bag
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [errors, setErrors] = useState<ProfileFormProps["errors"]>({});

//   // 2) Toggle icons
//   const passwordIcon = <Ionicons name={showPwd ? "eye" : "eye-off"} size={20} color={colors.gray40} />;
//   const confirmIcon = <Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color={colors.gray40} />;

//   // 3) Validation logic
//   const validate = (): boolean => {
//     const errs: ProfileFormProps["errors"] = {};
//     if (!firstName.trim()) errs.firstName = "Insert a name";
//     if (!lastName.trim()) errs.lastName = "Insert a last name";
//     if (!/^\+\d{2}\s?\d{6,}$/.test(phone)) errs.phone = "Insert a valid phone number";
//     if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) errs.email = "Email not valid";
//     if (password.length < 6) errs.password = "Password too short. Choose at least 6 characters.";
//     if (confirm !== password) errs.confirm = "Passwords don’t match";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // 4) Next button handler
//   const onNext = () => {
//     if (validate()) {
//       Alert.alert("Success", "All fields look good!");
//       // TODO: navigate to payment screen or next signup step
//     }
//   };
{
  /* <ProfileForm firstName={firstName} lastName={lastName} phone={phone} email={email} password={password} confirm={confirm} showPwd={showPwd} showConfirm={showConfirm} errors={errors} onChangeFirstName={setFirstName} onChangeLastName={setLastName} onChangePhone={setPhone} onChangeEmail={setEmail} onChangePassword={setPassword} onChangeConfirm={setConfirm} onToggleShowPwd={() => setShowPwd((v) => !v)} onToggleShowConfirm={() => setShowConfirm((v) => !v)} onNext={onNext} passwordIcon={passwordIcon} confirmIcon={confirmIcon} />; */
}
