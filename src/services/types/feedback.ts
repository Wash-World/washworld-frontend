export interface FeedbackDto {
  feedback_id: number;
  wash_history_id: number;
  rating: number;
  comment: string;
  photo?: string;
}

//shape of the object for POST feedback
export interface PostFeedbackDto {
  wash_history_id: number;
  rating: number;
  comment?: string;
  //photo?:string;
}

//shape of the object for PATCH feedback
export interface PatchFeedbackDto {
  feedbackId: number;
  comment: string;
  //photo?:string;
}
