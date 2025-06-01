// hooks/useFeedbackHooks.ts

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../store";
import type { PostFeedbackDto, PatchFeedbackDto, FeedbackDto } from "../services/types/feedback";
import { fetchFeedbacksForWash, patchFeedback, postFeedback } from "../services/api/feedback";

export function usePostFeedback() {
  const token = useAppSelector((s) => s.auth.token)!;
  const userId = useAppSelector((s) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<FeedbackDto, Error, PostFeedbackDto>({
    mutationFn: (payload) => postFeedback(payload, token), // mutation for posting and patching
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}

export function usePatchFeedback() {
  const token = useAppSelector((s) => s.auth.token)!;
  const userId = useAppSelector((s) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<void, Error, PatchFeedbackDto>({
    mutationFn: (payload) => patchFeedback(payload, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}

export function useFeedbacksForWash(washId: number) {
  const token = useAppSelector((s) => s.auth.token)!;
  return useQuery<FeedbackDto[], Error>({
    queryKey: ["feedbacks", washId],
    queryFn: () => fetchFeedbacksForWash(washId, token),
    enabled: !!token,
  });
}
