import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InputField from "../elements/InputField";
import colors from "../../constants/colors";

interface PaymentProps {
  owner: string;
  onChangeOwner: (text: string) => void;
  number: string;
  onChangeNumber: (text: string) => void;
  expiry: string;
  onChangeExpiry: (text: string) => void;
  cvv: string;
  onChangeCvv: (text: string) => void;
  errors: {
    owner?: string;
    number?: string;
    expiry?: string;
    cvv?: string;
  };
}

const Payment: React.FC<PaymentProps> = ({ owner, onChangeOwner, number, onChangeNumber, expiry, onChangeExpiry, cvv, onChangeCvv, errors }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Card Payment</Text>
    <InputField label="Card Owner" placeholder="John Doe" value={owner} onChangeText={onChangeOwner} error={errors.owner} />
    <InputField label="Card number" placeholder="1234 5678 9012 3456" keyboardType="number-pad" value={number} onChangeText={onChangeNumber} error={errors.number} />
    <View style={styles.row}>
      <View style={styles.halfWidth}>
        <InputField label="Expiration date" placeholder="MM/YY" value={expiry} onChangeText={onChangeExpiry} error={errors.expiry} />
      </View>
      <View style={styles.halfWidth}>
        <InputField label="CVV" placeholder="000" keyboardType="number-pad" secureTextEntry value={cvv} onChangeText={onChangeCvv} error={errors.cvv} />
      </View>
    </View>
  </ScrollView>
);

export default Payment;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray80,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    flex: 1,
    marginRight: 8,
  },
});

//how to use it
// export default function PaymentScreen() {
//   const [owner, setOwner] = useState("");
//   const [number, setNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [errors, setErrors] = useState<{
//     owner?: string;
//     number?: string;
//     expiry?: string;
//     cvv?: string;
//   }>({});

//   const validate = () => {
//     const newErrors: typeof errors = {};

//     // 1) Owner: at least two words, letters and spaces only
//     if (!/^[A-Za-z]+(?: [A-Za-z]+)+$/.test(owner.trim())) {
//       newErrors.owner = "Enter first and last name";
//     }

//     // 2) Card number: 16 digits, grouped in fours
//     if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(number.replace(/-/g, " "))) {
//       newErrors.number = "Use format 1234 5678 9012 3456";
//     }

//     // 3) Expiry: valid MM/YY, and not in the past
//     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
//       newErrors.expiry = "Use format MM/YY";
//     } else {
//       const [mm, yy] = expiry.split("/").map((s) => parseInt(s, 10));
//       const now = new Date();
//       const expDate = new Date(2000 + yy, mm);
//       if (expDate <= now) {
//         newErrors.expiry = "Card has expired";
//       }
//     }

//     // 4) CVV: 3 or 4 digits
//     if (!/^\d{3,4}$/.test(cvv)) {
//       newErrors.cvv = "3 or 4 digit code";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const onSubmit = () => {
//     if (validate()) {
//       // all good — send to your payment API
//       Alert.alert("Success", "All fields look valid!");
//     }
//   };
{
  /* <Payment owner={owner} onChangeOwner={setOwner} number={number} onChangeNumber={setNumber} expiry={expiry} onChangeExpiry={setExpiry} cvv={cvv} onChangeCvv={setCvv} errors={errors} />
      <Button title="Submit Payment" onPress={onSubmit} /> */
}
