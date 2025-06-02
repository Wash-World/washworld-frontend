import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { LAN_IP } from "../constants/env";
import { postWash } from "../services/api/washes";
import { PostWashDto, PostWashResponse } from "../services/types/washes";

export function useStartWash() {
  const token = useSelector((s: RootState) => s.auth.token)!;
  const userId = useSelector((s: RootState) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<PostWashResponse, Error, PostWashDto>({
    mutationFn: (payload) => postWash(payload, token),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}
