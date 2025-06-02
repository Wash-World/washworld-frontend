import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InputField from "../elements/InputField";
import colors from "../../constants/colors";

interface PaymentProps {
  owner: string;
  onChangeOwner: (text: string) => void;
  onBlurOwner: () => void;
  number: string;
  onChangeNumber: (text: string) => void;
  onBlurNumber: () => void;
  expiry: string;
  onChangeExpiry: (text: string) => void;
  onBlurExpiry: () => void;
  cvv: string;
  onChangeCvv: (text: string) => void;
  onBlurCvv: () => void;
  errors: {
    owner?: string;
    number?: string;
    expiry?: string;
    cvv?: string;
  };
}

const Payment: React.FC<PaymentProps> = ({ owner, onChangeOwner, onBlurOwner, number, onChangeNumber, onBlurNumber, expiry, onChangeExpiry, onBlurExpiry, cvv, onChangeCvv, onBlurCvv, errors }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Card Payment</Text>

    <InputField label="Card Owner" placeholder="John Doe" value={owner} onChangeText={onChangeOwner} onBlur={onBlurOwner} error={errors.owner} />

    <InputField label="Card number" placeholder="1234 5678 9012 3456" keyboardType="number-pad" value={number} onChangeText={onChangeNumber} onBlur={onBlurNumber} error={errors.number} />

    <View style={styles.row}>
      <View style={styles.halfWidth}>
        <InputField label="Expiration date" placeholder="MM/YY" value={expiry} onChangeText={onChangeExpiry} onBlur={onBlurExpiry} error={errors.expiry} />
      </View>
      <View style={styles.halfWidth}>
        <InputField label="CVV" placeholder="000" keyboardType="number-pad" secureTextEntry value={cvv} onChangeText={onChangeCvv} onBlur={onBlurCvv} error={errors.cvv} />
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
