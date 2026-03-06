import { cookies } from "next/headers";
import {api} from "./api";
import { Note } from "../../types/note";
import { User } from "../../types/user";
import { NoteHttpResponse } from "./clientApi";

export default async function fetchNotes(
  query: string,
  page: number,
  tag?: string,
): Promise<NoteHttpResponse> {
  const cookieStore = await cookies();

  const response = await api.get<NoteHttpResponse>("/notes", {
    params: {
      search: query,
      page,
      tag: tag || undefined,
      perPage: 12,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const responseById = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return responseById.data;
}

export const getMe = async () => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};