import { api } from "./api";
import type {
  Word,
  PaginatedWordsResponse,
  CreateWordRequest,
  EditWordRequest,
  Category,
} from "@/types/word";

/* =========================
   GET OWN WORDS
========================= */

export async function getOwnWords(params: {
  page: number;
  limit: number;
  keyword?: string;
  category?: Category;
}) {
  const res = await api.get<PaginatedWordsResponse>("/words/own", {
    params,
  });

  return res.data;
}

/* =========================
   CREATE WORD
========================= */

export async function createWord(data: CreateWordRequest) {
  const res = await api.post<Word>("/words/create", data);
  return res.data;
}

/* =========================
   EDIT WORD
========================= */

export async function editWord(
  id: string,
  data: EditWordRequest
) {
  const res = await api.patch<Word>(
    `/words/edit/${id}`,
    data
  );

  return res.data;
}

/* =========================
   DELETE WORD
========================= */

export async function deleteWord(id: string) {
  const res = await api.delete<{ message: string }>(
    `/words/delete/${id}`
  );

  return res.data;
}

/* =========================
   GET CATEGORIES
========================= */

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/words/categories");
  return res.data;
}