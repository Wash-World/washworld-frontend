import React, { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Location } from "../../services/types/location";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import colors from "../../constants/colors";

type LocationPayload = {
  location_id: string;
};

type MapProps = {
  locations: Location[];
  selectedLocation?: Location | null;
  setSelectedLocation?: (payload: LocationPayload) => void;
};

const Map: React.FC<MapProps> = ({ locations, selectedLocation, setSelectedLocation }) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const lat = parseFloat(selectedLocation.coordinates.y);
      const lng = parseFloat(selectedLocation.coordinates.x);

      if (!isNaN(lat) && !isNaN(lng)) {
        const zoomDelta = 0.01; // Small = zoomed in, Large = zoomed out

        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: zoomDelta,
            longitudeDelta: zoomDelta,
          },
          2000 // 2 second animation
        );
      }
    }
  }, [selectedLocation]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 56.1629,
        longitude: 10.2039,
        latitudeDelta: 3,
        longitudeDelta: 3,
      }}
    >
      {locations.map((loc) => {
        const latitude = parseFloat(loc.coordinates.y);
        const longitude = parseFloat(loc.coordinates.x);
        if (isNaN(latitude) || isNaN(longitude)) return null;

        return (
          <Marker
            onPress={() => {
              console.log("Marker pressed", loc.name);
                  setSelectedLocation?.({ location_id: loc.Location_id }); // <-- this line

            }}
            key={loc.uid}
            coordinate={{ latitude, longitude }}
            title={loc.name}
            description={loc.address}
          >
            <Callout>
              <View>
                <Text>{loc.name}</Text>
                <Text>{loc.address}</Text>
                <Text>{loc.open_hours}</Text>
                <Text style={{ marginTop: 8, color: colors.greenBrand }}>Add to Favourites</Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: 400,
    height: 400,
  },
  favButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  favText: {
    marginLeft: 6,
    color: "red",
    fontWeight: "bold",
  },
});

export default Map;
