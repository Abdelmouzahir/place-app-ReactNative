import { StyleSheet, View, Alert, Text } from "react-native";
import OutlinedButton from "../../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps"; // Import MapView directly here
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

export default function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState(null);
  const [locationPermission, requestPermission] =
    Location.useForegroundPermissions();
  const [readablelocation, setreadableLocation] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    onPickLocation({ ...pickedLocation, address: readablelocation });
  }, [pickedLocation, onPickLocation, readablelocation]);

  async function verifyPermission() {
    if (locationPermission.status === Location.PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermission.status === Location.PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Denied",
        "You need to grant location permissions to use this app",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    const location = await Location.getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    console.log(location);
    console.log(pickedLocation);
    // Reverse Geocode to get human-readable address
    const addressData = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // Extract address from the first result (if available)
    if (addressData.length > 0) {
      const { name, street, city, region, postalCode, country } =
        addressData[0];
      setreadableLocation(
        `${name || street}, ${city}, ${region}, ${postalCode}, ${country}`
      );
    }
  }
  console.log(readablelocation);

  function pickOnMapHandler() {
    // Implement this function to pick a location on the map
    navigation.navigate("Map");
  }

  // Conditionally render MapView or a placeholder text
  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <MapView
        style={styles.mapPreview}
        region={{
          latitude: pickedLocation.lat,
          longitude: pickedLocation.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      />
    );
  }

  return (
    <View>
      <View style={styles.mapContainer}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
