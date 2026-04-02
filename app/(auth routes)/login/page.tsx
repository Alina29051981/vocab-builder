// app/(auth routes)/login/page.tsx
"use client";

import { AxiosError } from "axios";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../lib/validation/loginSchema";
import { useAuth } from "../../../lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { InferType } from "yup";
import css from "../styles/AuthForm.module.css";
import { SignInRequest } from "../../../types/auth";

type FormValues = Required<InferType<typeof loginSchema>>;

const resolver: Resolver<FormValues> = yupResolver(loginSchema) as unknown as Resolver<FormValues>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const payload: SignInRequest = {
      email: data.email,
      password: data.password,
    };

    try {
      await login(payload);
      toast.success("Successfully logged in");
      router.push("/dictionary");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className={css.card}>
      <h1 className={css.title}>Login</h1>
      <p className={css.text}>
        Please enter your login details to continue using our service:
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <div className={css.field}>
          <input
            className={`${css.input} ${errors.email ? css.inputError : ""}`}
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div className={`${css.field} ${css.passwordField}`}>
          <input
            className={`${css.input} ${errors.password ? css.inputError : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <button
            type="button"
            className={css.togglePassword}
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? (
              // eye-off
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_52_12049)">
                  <path d="M14.95 14.95C13.5255 16.0358 11.7909 16.6374 9.99998 16.6667C4.16665 16.6667 0.833313 10 0.833313 10C1.86989 8.06825 3.30759 6.38051 5.04998 5.05M8.24998 3.53333C8.82359 3.39907 9.41087 3.33195 9.99998 3.33333C15.8333 3.33333 19.1666 10 19.1666 10C18.6608 10.9463 18.0575 11.8373 17.3666 12.6583M11.7666 11.7667C11.5378 12.0123 11.2618 12.2093 10.9551 12.3459C10.6484 12.4826 10.3174 12.556 9.98172 12.562C9.64605 12.5679 9.31262 12.5061 9.00132 12.3804C8.69003 12.2547 8.40725 12.0675 8.16985 11.8301C7.93246 11.5927 7.74531 11.31 7.61957 10.9987C7.49383 10.6874 7.43209 10.3539 7.43801 10.0183C7.44393 9.68258 7.5174 9.35154 7.65404 9.04487C7.79068 8.73821 7.98769 8.46221 8.23331 8.23333" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0.833313 0.833344L19.1666 19.1667" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_52_12049">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            ) : (
              // eye
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_83_22633)">
                  <path d="M0.833252 10C0.833252 10 4.16659 3.33333 9.99992 3.33333C15.8333 3.33333 19.1666 10 19.1666 10C19.1666 10 15.8333 16.6667 9.99992 16.6667C4.16659 16.6667 0.833252 10 0.833252 10Z" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#121417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_83_22633">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            )}
          </button>
          {errors.password && <p className={css.error}>{errors.password.message}</p>}
        </div>

        <button type="submit" className={css.button}>
          Login
        </button>
      </form>

      <p className={css.text}>
        <Link href="/register" className={css.link}>
          Register
        </Link>
      </p>
    </div>
  );
}