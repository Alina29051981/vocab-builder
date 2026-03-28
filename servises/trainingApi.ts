// components/servises/trainingApi.ts

import { PostAnswersRequest, PostAnswersResponse } from "@/types/training";
import { api } from "../lib/api/api"
export const saveTrainingResults = async (
  answers: PostAnswersRequest
): Promise<PostAnswersResponse> => {
  const response = await api.post("/training/save", answers);
  return response.data;
};