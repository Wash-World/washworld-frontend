import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../store";
import { fetchWashHistory } from "../services/api/washes";
import type { WashHistoryResponseDto } from "../services/types/washes";

export function useWashHistory() {
  //user & token from Redux
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  return useQuery<WashHistoryResponseDto[], Error>({
    queryKey: ["washHistory", user?.id], //  key includes user.id so cache is per-user
    enabled: Boolean(user?.id && token), //  only run if we actually have a user & token
    queryFn: () => fetchWashHistory(user!.id, token!), //call the fetcher
  });
}
