import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";
import { colors } from "../../constants/colors";

type ButtonProps = {
  title: string;
  variant?: "primary" | "delete";
  disabled?: boolean;
  // onPress?: (event: GestureResponderEvent) => void;
    onPress?: () => void; // 👈 No event expected

};

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  disabled = false,
  onPress,
}) => {
  const buttonStyle = [
    styles.button,
    variant === "delete" && styles.deleteButton,
    disabled && styles.disabledButton,
  ];

  const textStyle = [styles.buttonText, variant === "delete" && styles.deleteButtonText];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.greenBrand, // primary color
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#00000029",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: colors.white,
  },
});

export default Button;
