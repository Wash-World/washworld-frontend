import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store";
import { LAN_IP } from "../constants/env";
import type { FeedbackDto } from "../services/types/feedback";

export interface FeedbackResponse {
  feedback_id: number;
}

export interface PostFeedbackVars {
  wash_history_id: number;
  rating: number;
  comment: string;
}

export interface PatchFeedbackVars {
  feedbackId: number;
  comment: string;
}
//for create feedback
export function usePostFeedback() {
  const token = useAppSelector((s) => s.auth.token)!;
  const userId = useAppSelector((s) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<FeedbackResponse, Error, PostFeedbackVars>({
    mutationFn: async ({ wash_history_id, rating, comment }) => {
      const res = await fetch(`http://${LAN_IP}:3000/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wash_history_id, rating, comment }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}

//for updating the feedback
export function usePatchFeedback() {
  const token = useAppSelector((s) => s.auth.token)!;
  const userId = useAppSelector((s) => s.auth.user.id);
  const qc = useQueryClient();

  return useMutation<void, Error, PatchFeedbackVars>({
    mutationFn: async ({ feedbackId, comment }) => {
      const res = await fetch(`http://${LAN_IP}:3000/feedbacks/${feedbackId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["washHistory", userId] });
    },
  });
}
