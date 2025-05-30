export interface FeedbackDto {
  feedback_id: number;
  rating: number;
  comment: string;
  photo?: string;
}

export interface WashHistoryResponseDto {
  wash_history_id: number;
  location_api_id: string;
  timestamp: string;
  feedbacks: FeedbackDto[];
}
