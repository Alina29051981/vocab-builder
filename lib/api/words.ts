// lib/api/words.ts
import { isAxiosError } from "axios";
import { api } from "./api";
import type {
  Word,
  PaginatedWordsResponse,
  CreateNewWordRequest,
  EditWordRequest,
  Category,
  CreateNewWordResponse
} from "@/types/word";

export async function getOwnWords(params: {
  page: number;
  limit: number;
  keyword?: string;
  category?: Category;
  isIrregular?: boolean;
}): Promise<PaginatedWordsResponse> {
  const { page, limit, keyword, category, isIrregular } = params;
  const res = await api.get<PaginatedWordsResponse>("/words/own", {
    params: { page, limit, ...(keyword && { keyword }), ...(category && { category }), ...(isIrregular !== undefined && { isIrregular }) },
  });
  return res.data;
}

export async function getAllWords(params: {
  page: number;
  limit: number;
  keyword?: string;
  category?: Category;
  isIrregular?: boolean;
}): Promise<PaginatedWordsResponse> {
  const res = await api.get<PaginatedWordsResponse>("/words/all", { params });
  return res.data;
}

export async function createWord(data: CreateNewWordRequest): Promise<CreateNewWordResponse> {
  if (data.category === "verb" && data.isIrregular === undefined) {
    throw new Error("isIrregular field is required for verbs");
  }
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");
  const res = await api.post<CreateNewWordResponse>("/words/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addWordFromOtherUser(id: string): Promise<Word> {
  const res = await api.post<Word>(`/words/add/${id}`);
  return res.data;
}

export async function editWord(id: string, data: EditWordRequest): Promise<Word> {
  const res = await api.patch<Word>(`/words/edit/${id}`, data);
  return res.data;
}

export async function deleteWord(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await api.delete<{ message: string }>(`/words/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      
      if (error.response?.status === 404) {
        return { message: "Word already deleted" };
      }

      throw new Error(error.response?.data?.message || "Failed to delete word");
    }

    throw new Error("Failed to delete word");
  }
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/words/categories");
  return res.data;
}

export async function getUserStatistics(): Promise<{ totalCount: number }> {
  const res = await api.get<{ totalCount: number }>("/words/statistics");
  return res.data;
}

export async function getRecommendedWords(params: { page: number; limit: number; keyword?: string; category?: string; isIrregular?: boolean; }) {
  const res = await api.get<PaginatedWordsResponse>("/words/all", { params });
  return res.data;
}