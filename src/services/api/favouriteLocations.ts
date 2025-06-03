import { LAN_IP } from "../../constants/env";
import { FavouriteLocation } from "../types/favouriteLocation";

const BASE_URL = `http://${LAN_IP}:3000`;

export const getFavouriteLocations = async (
  userId: number,
  token: string
): Promise<FavouriteLocation[]> => {
  const res = await fetch(`${BASE_URL}/favourites/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
};

export const addFavouriteLocation = async ({
  locationId,
  userId,
  token,
}: {
  locationId: string;
  userId: number;
  token: string;
}): Promise<void> => {
  const res = await fetch(`${BASE_URL}/favourites`, {
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
    throw new Error(err.message || "Failed to add favourite");
  }
};
