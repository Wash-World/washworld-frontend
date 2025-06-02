import { LAN_IP } from "../../constants/env";

export const addFavouriteLocation = async (
  locationId: string,
  userId: number,
  token: string
): Promise<void> => {
  try {
    const res = await fetch(`http://${LAN_IP}:3000/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        location_api_id: locationId,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to add favourite:", err.message || res.statusText);
    } else {
      console.log("Location added to favourites!");
    }
  } catch (error) {
    console.error("Error adding to favourites:", error);
  }
};
