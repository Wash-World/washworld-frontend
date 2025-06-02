import { useQuery } from "@tanstack/react-query";
import { fetchMemberships } from "../services/api/memberships";

export const useMemberships = () =>
  useQuery({
    queryKey: ["memberships"],
    queryFn: fetchMemberships,
  });
