import React, { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Location } from "../../services/types/location";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import colors from "../../constants/colors";

type MapProps = {
  locations: Location[];
  selectedLocation?: Location | null;
  setSelectedLocation?: (location_id: string) => void;
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
              setSelectedLocation?.(loc.Location_id); // This will update the selectedLocationId state in the parent component
            }}
            key={loc.uid}
            coordinate={{ latitude, longitude }}
            title={loc.name}
            description={loc.address}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{loc.name}</Text>
                <Text style={styles.calloutAddress}>{loc.address}</Text>
                <Text style={styles.calloutHours}>
                  <Text style={styles.calloutHoursLabel}>Opening hours: </Text>
                  {loc.open_hours}
                </Text>

                <View style={styles.calloutActionContainer}>
                  <FontAwesome name="heart" size={14} color={colors.greenBrand} />
                  <Text style={styles.calloutAction}>Add to Favourites</Text>
                </View>
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
  calloutContainer: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    minWidth: 220,
    elevation: 4, // Android shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  calloutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray80,
    marginBottom: 4,
  },

  calloutAddress: {
    fontSize: 14,
    color: colors.gray60,
    marginBottom: 2,
  },

  calloutHours: {
    fontSize: 13,
    color: colors.gray40,
    marginBottom: 8,
  },

  calloutActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  calloutAction: {
    marginLeft: 6,
    color: colors.greenBrand,
    fontWeight: "600",
    fontSize: 14,
  },
  calloutHoursLabel: {
    fontWeight: "600",
    color: colors.gray60,
  },
});

export default Map;
