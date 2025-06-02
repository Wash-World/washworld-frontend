import React, { use, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Select from "../../components/elements/Select";
import LocationMap from "../../components/Location /LocationMap";
import { useLocations } from "../../hooks/useLocations";
import { useAppSelector } from "../../store";
import { addFavouriteLocation } from "../../services/api/addFavouriteLocation";
import Button from "../../components/elements/Button";

const LocationScreen = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const { data: locations = [], isLoading: locLoading } = useLocations();

  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc.Location_id,
  }));

  const handleAddFavourite = ({ Location_id }: { Location_id: string }) => {
    // Check if user and token are available before proceeding
    console.log(user, token);
    if (!user || !token) {
      console.warn("User or token not available. Cannot add favourite location.");
      return;
    }
    addFavouriteLocation(Location_id, user.id, token);
  };

  return (
    <View style={styles.container}>
      <Text>Location Screen</Text>

      <LocationMap
        locations={locations}
        selectedLocation={
          selectedLocationId
            ? locations.find((loc) => loc.Location_id === selectedLocationId) || null
            : null
        }
        setSelectedLocation={({ location_id }) => setSelectedLocationId(location_id)}
      />

      {selectedLocationId && (
        <>
          <Text style={{ marginTop: 20, marginBottom: 10 }}>
            Selected Location:{" "}
            {locations.find((loc) => loc.Location_id === selectedLocationId)?.Location_id || "Unknown"}
          </Text>

          <Button
            title="Add to Favourites"
            onPress={() => handleAddFavourite({ Location_id: selectedLocationId })}
          />
        </>
      )}
      <Select
        label="Location"
        options={locationOptions}
        selectedValue={selectedLocationId}
        onValueChange={setSelectedLocationId}
        placeholder="Select a location"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});

export default LocationScreen;
