import * as yup from "yup";
import { CATEGORIES, Category } from "@/types/word";

export const createWordSchema = yup.object({
  en: yup.string().required("English word is required"),

  ua: yup.string().required("Translation is required"),

  category: yup
  .mixed<Category>()
  .oneOf(CATEGORIES, "Invalid category")
  .required("Category is required"),

  isIrregular: yup.boolean(),
});