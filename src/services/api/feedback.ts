import { LAN_IP } from "../../constants/env";
import type { FeedbackDto } from "../types/feedback";

export async function fetchFeedbacksForWash(washId: number, token: string): Promise<FeedbackDto[]> {
  const res = await fetch(`http://${LAN_IP}:3000/feedbacks/wash/${washId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Error fetching feedback: ${res.status}`);
  }
  return res.json();
}
