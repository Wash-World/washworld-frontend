import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Select from "../../components/elements/Select";
import LocationMap from "../../components/Location/LocationMap";
import { useLocations } from "../../hooks/useLocations";
import { useAppSelector } from "../../store";
import Button from "../../components/elements/Button";
import colors from "../../constants/colors";
import { useAddFavouriteLocation } from "../../hooks/useAddFavouriteLocation";

const LocationScreen = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const { data: locations = [], isLoading: locLoading } = useLocations();

  const addFavouriteLocationMutation = useAddFavouriteLocation(user?.id);

  const locationOptions = locations.map((loc) => ({
    label: loc.name,
    value: loc.Location_id,
  }));

  const handleAddFavourite = (locationId: string) => {
    if (!user || !token) {
      console.warn("User or token not available. Cannot add favourite location.");
      return;
    }

    addFavouriteLocationMutation.mutate({
      locationId,
      userId: user.id,
      token,
    });
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
        setSelectedLocation={setSelectedLocationId}
      />

      <Select
        label="Select a location"
        options={locationOptions}
        selectedValue={selectedLocationId}
        onValueChange={setSelectedLocationId}
        placeholder="Select a location"
      />

      {selectedLocationId && (
        <>
          {/* <Text style={{ marginTop: 20, marginBottom: 10 }}>
            Selected Location:
            {locations.find((loc) => loc.Location_id === selectedLocationId)?.name ||
              "Unknown"}
          </Text> */}

          <Button
            title="Add to Favourites"
            onPress={() => handleAddFavourite(selectedLocationId)}
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
