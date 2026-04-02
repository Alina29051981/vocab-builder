// components/lib/validation/editWordSchema.ts
import * as yup from "yup";
import type { InferType } from "yup";

export const editWordSchema = yup.object({
  en: yup
    .string()
    .required("English word is required")
    .matches(
      /^[A-Za-z\s'-]+$/,
      "The en field can include only English letters, spaces, apostrophes, and hyphens"
    ),
  ua: yup
    .string()
    .required("Ukrainian translation is required")
    .matches(
      /^[А-ЯІЄЇҐа-яієїґʼ\s-]+$/u,
      "The ua field can include only Ukrainian letters, spaces, apostrophes, and hyphens"
    ),
});

export type FormValues = InferType<typeof editWordSchema>;