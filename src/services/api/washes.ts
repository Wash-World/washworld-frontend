import { LAN_IP } from "../../constants/env";
import { PostWashDto, PostWashResponse } from "../types/washes";
import type { WashHistoryResponseDto } from "../types/washes";

export async function postWash(payload: PostWashDto, token: string): Promise<PostWashResponse> {
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
}

export async function fetchWashHistory(userId: number, token: string): Promise<WashHistoryResponseDto[]> {
  const res = await fetch(`http://${LAN_IP}:3000/washes/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json();
}
