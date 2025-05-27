import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  onIconPress?: () => void;
}

const InputField: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  icon,
  onIconPress,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputErrorBorder : styles.inputBorder,
        ]}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.gray40}
          style={styles.input}
          {...rest}
        />
        {icon && (
          <TouchableOpacity onPress={onIconPress}>{icon}</TouchableOpacity>
        )}
      </View>

      {error && <Text style={{ color: colors.error }}>{error}</Text>}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    width: "100%",
  },
  input: {
    color: colors.gray60,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: colors.gray10,
  },
  inputErrorBorder: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  label: {
    color: colors.gray80,
    marginBottom: 10,
  },
});

// example

// export default function App() {
//   const [secure, setSecure] = useState(true);
//   const [error, setError] = useState("");

//   return (
//     <View style={styles.container}>
//       <View style={styles.layout}>
//         <InputField label="Email" placeholder="Insert your email" />
//         <InputField
//           label="Password"
//           placeholder="Insert your password"
//           secureTextEntry={secure}
//           icon={
//             <Ionicons
//               name={secure ? "eye-off" : "eye"}
//               size={20}
//               color="gray"
//             />
//           }
//           onIconPress={() => setSecure((prev) => !prev)}
//           error={error}
//         />
//       </View>
//       <StatusBar style="auto" />
//     </View>
//   );
// }
