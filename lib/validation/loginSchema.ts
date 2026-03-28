// components/lib/validation/loginSchema.ts

import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
     .trim()
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .matches(
      /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/,
      "Invalid password"
    )
    .required("Password is required"),
});