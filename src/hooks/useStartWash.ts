import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { LAN_IP } from "../constants/env";

export interface StartWashPayload {
  user_id: number;
  location_api_id: string;
}
export interface StartWashResponse {
  wash_history_id: number;
}

export function useStartWash() {
  const token = useSelector((s: RootState) => s.auth.token)!;
  const userId = useSelector((s: RootState) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<StartWashResponse, Error, StartWashPayload>({
    mutationFn: async (payload) => {
      const res = await fetch(`http://${LAN_IP}:3000/washes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}
