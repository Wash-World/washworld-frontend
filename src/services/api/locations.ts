import { Location } from "../types/location";


export async function fetchLocations(): Promise<Location[]> {
  try {
    const response = await fetch(
      "https://washworld.dk/wp-json/ww/v1/locations?country=da&cacheBuster=17461100"
    );

    if (!response.ok) {
      throw new Error(`Error fetching locations: ${response.status}`);
    }

    const data: Location[] = await response.json();
    return data;
  } catch (error) {
    console.error("Location fetch error:", error);
    throw error;
  }
}



