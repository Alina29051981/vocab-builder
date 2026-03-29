// lib/api/training.ts
import type { OwnWord, PostAnswerItem, PostAnswersResponse, TaskWord } from "@/types/training";
import { api } from "./api";

export async function getTrainingWords(): Promise<TaskWord[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const [tasksRes, ownRes] = await Promise.all([
    api.get<{ words: TaskWord[] }>("/words/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    api.get<{ results: OwnWord[] }>("/words/own", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const tasks = tasksRes.data.words ?? [];
  const ownWords = ownRes.data.results ?? [];

    return tasks.map(task => {
    const fullWord = ownWords.find(w => w._id === task._id);
    return {
      ...task,
      en: fullWord?.en || "",
      ua: fullWord?.ua || task.ua,
    };
  });
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