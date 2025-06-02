import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Select from "../../components/elements/Select";
import LocationMap from "../../components/Location /LocationMap";
import { useLocations } from "../../hooks/useLocations";
import { useAppSelector } from "../../store";
import { addFavouriteLocation } from "../../services/api/addFavouriteLocation";
import Button from "../../components/elements/Button";
import colors from "../../constants/colors";

const LocationScreen = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const { data: locations = [], isLoading: locLoading } = useLocations();

  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc.Location_id,
  }));

  const handleAddFavourite = (location_id: string) => {
    // Check if user and token are available before proceeding
    console.log(user, token);
    if (!user || !token) {
      console.warn("User or token not available. Cannot add favourite location.");
      return;
    }
    addFavouriteLocation(location_id, user.id, token);
  };

  return (
    <View style={styles.container}>
<Text style={styles.pageTitle}>Map view</Text>

      <LocationMap
        locations={locations}
        selectedLocation={
          selectedLocationId
            ? locations.find((loc) => loc.Location_id === selectedLocationId) || null
            : null
        }
        setSelectedLocation={setSelectedLocationId} // This will update the selecltedLocationId state
      />

      <Select
        label="Select a location"
        options={locationOptions}
        selectedValue={selectedLocationId}
        onValueChange={setSelectedLocationId} // This will update the selecltedLocationId state
        placeholder="Select a location"
      />

      {selectedLocationId && (
        <>
          <Text style={{ marginTop: 20, marginBottom: 10 }}>
            Selected Location:{" "}
            {locations.find((loc) => loc.Location_id === selectedLocationId)?.Location_id ||
              "Unknown"}
          </Text>

          <Button
            title="Add to Favourites"
            onPress={() => handleAddFavourite(selectedLocationId)} // This will send the POST request to add the location to favourites
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
  },
  pageTitle: {
  fontSize: 28,
  fontWeight: "700",
  color: colors.gray80,
  marginBottom: 20,
  textAlign: "center",
},

});

export default LocationScreen;
