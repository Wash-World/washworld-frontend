export interface MembershipResponseDto {
  id: number;
  plan: string;
  price: number;
  duration_wash: number;
  serviceIds?: number[];
}
