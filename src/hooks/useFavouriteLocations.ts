import { useQuery } from "@tanstack/react-query";
import { getFavouriteLocations } from "../services/api/favouriteLocations";

export const useFavouriteLocations = (userId?: number, token?: string) => {
  return useQuery({
    queryKey: ["favouriteLocations"],
    queryFn: () => {
      if (!userId || !token) {
        return Promise.reject("User ID or token is missing");
      }
      return getFavouriteLocations(userId, token);
    },
    enabled: !!userId && !!token, // Only run if both are available
  });
};
