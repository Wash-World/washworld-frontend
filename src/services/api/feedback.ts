import { LAN_IP } from "../../constants/env";
import type { PostFeedbackDto, PatchFeedbackDto, FeedbackDto } from "../types/feedback";

//post a feedback
export async function postFeedback(payload: PostFeedbackDto, token: string): Promise<FeedbackDto> {
  const { wash_history_id, rating, comment } = payload;
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
}

//update the feedback
export async function patchFeedback(payload: PatchFeedbackDto, token: string): Promise<void> {
  const { feedbackId, comment } = payload;
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
}

// Get feedback for a specific wash id (specific wash)
export async function fetchFeedbacksForWash(washId: number, token: string): Promise<FeedbackDto[]> {
  const res = await fetch(`http://${LAN_IP}:3000/feedbacks/wash/${washId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Error fetching feedback: ${res.status}`);
  }
  return res.json();
}
