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
  owner?: string;
  progress?: number;
}

export interface PaginatedWordsResponse {
  results: Word[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateWordRequest {
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
}

export interface DeleteWordResponse {
  message: string;
  id?: string;
  _id?: string;
}