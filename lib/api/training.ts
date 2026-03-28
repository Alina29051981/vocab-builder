// lib/api/training.ts
import type { PostAnswerItem, PostAnswersResponse, TaskWord } from "@/types/training";
import { api } from "./api";

export async function getTrainingWords(): Promise<TaskWord[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await api.get<{ words: TaskWord[] }>("/words/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data?.words ?? [];
}

export async function postTrainingAnswers(
  answers: PostAnswerItem[]
): Promise<PostAnswersResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const response = await api.post<PostAnswersResponse>("/words/answers", answers, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}