import { useQuery } from "@tanstack/react-query";
import { fetchMemberships } from "../services/api/memberships";
import type { Membership } from "../services/types/membership";

export const useMemberships = () =>
  useQuery<Membership[], Error>({
    queryKey: ["memberships"],
    queryFn: fetchMemberships,
  });
