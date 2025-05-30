import type { MembershipResponseDto } from "../types/membership-response.dto";
import type { Membership } from "../types/membership";
import { LAN_IP } from "../../constants/env";

export async function fetchMemberships(): Promise<Membership[]> {
  const res = await fetch(`http://${LAN_IP}:3000/memberships`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
