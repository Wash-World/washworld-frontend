export interface FeedbackDto {
  feedback_id: number;
  wash_history_id: number;
  rating: number;
  comment: string;
  photo?: string;
}
