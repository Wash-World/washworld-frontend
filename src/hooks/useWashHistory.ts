// src/hooks/useWashHistory.ts

import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../store";
import { fetchWashHistory } from "../services/api/washHistory";
import type { WashHistoryResponseDto } from "../services/types/washHistory";

export function useWashHistory() {
  // 1️⃣ pull user & token from Redux
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  return useQuery<WashHistoryResponseDto[], Error>({
    // 2️⃣ key includes user.id so cache is per-user
    queryKey: ["washHistory", user?.id],
    // 3️⃣ only run if we actually have a user & token
    enabled: Boolean(user?.id && token),
    // 4️⃣ call the fetcher
    queryFn: () => fetchWashHistory(user!.id, token!),
  });
}
