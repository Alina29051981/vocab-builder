// components/lib/validation/createWordSchema.ts
import { object, string, boolean, mixed, ObjectSchema } from "yup";
import { CATEGORIES, Category } from "../../types/word";
import { validateVerbEn } from "./utils"; 

export type FormValues = {
  en: string;
  ua: string;
  category: Category;
  isIrregular?: boolean;
};

export const createWordSchema: ObjectSchema<FormValues, FormValues> = object({
  en: string()
    .required("English is required")
    .test(
      "verb-format",
            function (value) {
        const { category, isIrregular } = this.parent;
        if (category === "verb" && isIrregular) {
          return validateVerbEn(value || "", true);
        }
        return true;
      }
    ),
  ua: string().required("Ukrainian is required"),
  category: mixed<Category>()
    .oneOf(CATEGORIES, "Select a valid category")
    .required("Category is required"),
  isIrregular: boolean().when("category", {
    is: (val: Category) => val === "verb",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.strip(), 
  }),
});