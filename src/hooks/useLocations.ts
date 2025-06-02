import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../services/api/locations";

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: Infinity,
  });
