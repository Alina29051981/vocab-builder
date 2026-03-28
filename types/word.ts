// components/types/word.ts

export const CATEGORIES = [
  "verb",
  "participle",
  "noun",
  "adjective",
  "pronoun",
  "numerals",
  "adverb",
  "preposition",
  "conjunction",
  "phrasal verb",
  "functional phrase",
] as const;

export type Category = typeof CATEGORIES[number];

export interface Word {
  _id: string;
  en: string;
  ua: string;
  category: Category;
  isIrregular?: boolean;
  owner: string;
  progress: number;
}

export interface PaginatedWordsResponse {
  results: Word[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNewWordRequest {
  en: string;
  ua: string;
  category: Category;
  isIrregular?: boolean;
}

export interface EditWordRequest {
  en: string;
  ua: string;
  category: Category;
  isIrregular?: boolean;
  progress?: number;
}

export interface DeleteWordResponse {
  message: string;
  id?: string;
 }

export interface CreateNewWordResponse {
  _id: string;
  en: string;
  ua: string;
  category: string;
  isIrregular: boolean;
  owner: string;
  progress: number;
}

export interface GetAllWordsResponse {
  results: {
    _id: string;
    en: string;
    ua: string;
    category: string; 
    isIrregular: boolean;
  }[];
  totalPages: number;
  page: number;
  perPage: number;
}
