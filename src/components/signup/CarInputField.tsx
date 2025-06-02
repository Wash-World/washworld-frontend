import React from "react";
import { View, Text, TextInput, StyleSheet, Image, TextInputProps } from "react-native";
import colors from "../../constants/colors";

interface CarInputFieldProps extends TextInputProps {
  error?: string;
}

const CarInputField: React.FC<CarInputFieldProps> = ({ error, ...rest }) => (
  <View style={styles.wrapper}>
    <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : styles.inputBorder]}>
      <Image source={require("../../assets/Blue.png")} style={styles.flag} resizeMode="cover" />

      <TextInput style={styles.input} placeholder={rest.placeholder} placeholderTextColor={colors.gray40} {...rest} />
    </View>

    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default CarInputField;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  inputBorder: {
    borderColor: colors.gray20,
  },
  inputErrorBorder: {
    borderColor: colors.error,
  },
  flag: {
    width: 48,
    height: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    textAlignVertical: "center",
    color: colors.gray80,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    color: colors.error,
  },
});
//how to use it
// export default function App() {
//   const [plate, setPlate] = useState("");
//   const [plateError, setPlateError] = useState<string>();

//   const validatePlate = () => {
//     // Example regex: 2–3 letters + optional space + 2–4 digits (Danish style)
//     const regex = /^[A-Za-zÆØÅ]{2,3}\s?\d{2,4}$/;
//     if (!regex.test(plate.trim())) {
//       setPlateError("Insert a valid plate");
//       return false;
//     }
//     setPlateError(undefined);
//     return true;
//   };

//   const onNext = () => {
//     if (validatePlate()) {
//       Alert.alert("✅ Plate looks good!", plate);
//       // navigate or advance your flow…
//     }
//   };
{
  /* <CarInputField
        placeholder="Car plate number"
        value={plate}
        onChangeText={(text) => {
          setPlate(text);
          if (plateError) setPlateError(undefined);
        }}
        error={plateError}
      /> */
}
