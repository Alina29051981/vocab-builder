// components/lib/validation/editWordSchema.ts

import * as yup from "yup";

export const editWordSchema = yup.object({
  en: yup
    .string()
    .matches(/\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/, "Invalid English word")
    .required("English word is required"),

  ua: yup
    .string()
    .matches(
      /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ\s]+$/u,
      "Invalid Ukrainian translation"
    )
    .required("Ukrainian translation is required"),
});