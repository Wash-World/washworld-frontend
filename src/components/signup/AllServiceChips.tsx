import React from "react";
import { View, StyleSheet } from "react-native";
import ServiceChip from "../elements/ServiceChip";

// list of all the services
const ALL_SERVICES = ["Shampoo", "Tørring", "Børstevask", "Højtryksskyl", "Hjulvask", "Skyllevoks", "Undervognsskyl", "Polering", "Insektrens", "Affedtning", "Foam Splash", "Ekstra tørring"];

interface AllServiceChipsProps {
  activeServices: string[];
}

const AllServiceChips: React.FC<AllServiceChipsProps> = ({ activeServices }) => {
  const activeSet = new Set(activeServices);

  return (
    <View style={styles.container}>
      {ALL_SERVICES.map((name) => (
        <View style={styles.item} key={name}>
          <ServiceChip label={name} active={activeSet.has(name)} />
        </View>
      ))}
    </View>
  );
};

export default AllServiceChips;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  item: {
    width: "33.3333%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
});

//how to use
//define or fetch the active services of its membership
//const ACTIVE = ["Shampoo", "Tørring", "Børstevask", "Højtryksskyl", "Hjulvask"];
// <AllServiceChips activeServices={ACTIVE} />
