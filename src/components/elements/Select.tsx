import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../constants/colors'; // Adjust the import path as needed

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={(item) => onValueChange(item.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.black,
  },
  dropdown: {
    height: 50,
    borderColor: colors.gray20,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  placeholderStyle: {
    color: colors.white,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
  },
});

export default Select;
