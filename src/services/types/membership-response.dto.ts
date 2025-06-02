export interface MembershipResponseDto {
  membership_id: number;
  plan: string;
  price: number;
  duration_wash: number;
  services: {
    service_id: number;
    name: string;
  }[];
}
