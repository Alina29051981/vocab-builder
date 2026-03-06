export interface UsersStatisticsResponse {
  totalCount: number;
}

export interface TaskWord {
  _id: string;
  en?: string;
  ua?: string;
  task: "en" | "ua";
}

export interface GetUsersTasksResponse {
  words: TaskWord[];
}

export interface PostAnswerItem {
  _id: string;
  en: string;
  ua: string;
  task: "en" | "ua";
}

export type PostAnswersRequest = PostAnswerItem[];

export interface PostAnswerResult extends PostAnswerItem {
  isDone: boolean;
}

export type PostAnswersResponse = PostAnswerResult[];