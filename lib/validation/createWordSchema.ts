// components/lib/validation/createWordSchema.ts
import * as yup from "yup"; 
import { CATEGORIES, Category } from "../../types/word";
import { validateVerbEn } from "./utils"; 

export type FormValues = {
  en: string;
  ua: string;
  category: Category;
  isIrregular: boolean;
};

export const createWordSchema: yup.ObjectSchema<FormValues> = yup.object({
  en: yup
    .string()
    .required("English word is required")
    .matches(
      /^[A-Za-z\s'-]+$/,
      "The en field can include only English letters, spaces, apostrophes, and hyphens"
    )
    .test("verb-format", function (value) {
      const { category, isIrregular } = this.parent as FormValues;
      if (category === "verb" && isIrregular) {
        return validateVerbEn(value || "", true);
      }
      return true;
    }),
  ua: yup
    .string()
    .required("Ukrainian translation is required")
    .matches(
      /^[А-ЯІЄЇҐа-яієїґʼ\s-]+$/u,
      "The ua field can include only Ukrainian letters, spaces, apostrophes, and hyphens"
    ),
  category: yup
    .mixed<Category>()
    .oneOf(CATEGORIES, "Select a valid category")
    .required("Category is required"),
  isIrregular: yup.boolean().required(), 
});