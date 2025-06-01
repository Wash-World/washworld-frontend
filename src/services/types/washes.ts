import { FeedbackDto } from "./feedback";

export interface PostWashDto {
  user_id: number;
  location_api_id: string;
}

export interface PostWashResponse {
  wash_history_id: number;
}

export interface WashHistoryResponseDto {
  wash_history_id: number;
  location_api_id: string;
  timestamp: string;
  feedbacks: FeedbackDto[];
}
