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
            className={css.input}
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div className={`${css.field} ${css.passwordField}`}>
          <input
            className={css.input}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <button
            type="button"
            className={css.togglePassword}
            onClick={() => setShowPassword(prev => !prev)}
          >
            <svg width="20" height="20">
              <use
                href={`#${showPassword ? "icon-eye-off-2" : "icon-eye-2"}`}
              />
            </svg>
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