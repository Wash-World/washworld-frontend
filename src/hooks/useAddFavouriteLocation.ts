// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { addFavouriteLocation } from "../services/api/favouriteLocations";

// export const useAddFavouriteLocation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: addFavouriteLocation,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["favourites"] });
//     },
//   });
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavouriteLocation } from "../services/api/favouriteLocations";

export const useAddFavouriteLocation = (userId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      locationId,
      userId,
      token,
    }: {
      locationId: string;
      userId: number;
      token: string;
    }) => addFavouriteLocation({locationId, userId, token}),

    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["favouriteLocations"] });
      }
    },
  });
};
