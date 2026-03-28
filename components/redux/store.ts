// components/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../redux/categoriesSlice";
import wordsReducer from "../redux/wordsSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    words: wordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;