// components/redux/wordsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../lib/api/api";
import type { Word, PaginatedWordsResponse } from "@/types/word";

export interface WordsState {
  words: Word[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: WordsState = {
  words: [],
  loading: false,
  error: null,
  totalPages: 1,
};

export const fetchWords = createAsyncThunk(
  "words/fetch",
  async (params: { page: number; limit: number }) => {
    const res = await api.get<PaginatedWordsResponse>("/words/all", { params });
    return res.data;
  }
);

export const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWords.fulfilled,
        (state, action: PayloadAction<PaginatedWordsResponse>) => {
          state.loading = false;
          state.words = action.payload.results;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch words";
      });
  },
});

export default wordsSlice.reducer;