import { LAN_IP } from "../../constants/env";
import type { WashHistoryResponseDto } from "../types/washHistory";

export async function fetchWashHistory(userId: number, token: string): Promise<WashHistoryResponseDto[]> {
  const res = await fetch(`http://${LAN_IP}:3000/washes/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }
  return res.json();
}
