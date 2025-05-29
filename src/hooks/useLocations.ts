import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../services/api/locations";

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: Infinity, // never considered stale   // cache forever (until unmounted and GC'd)
  });
