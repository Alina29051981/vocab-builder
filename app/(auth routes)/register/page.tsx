// app/(auth routes)/register/page.tsx
"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../lib/validation/registerSchema";
import { useAuth } from "../../../lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import css from "../styles/AuthForm.module.css";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data);
      toast.success("Successfully registered");
      router.push("/dictionary");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message;
        if (typeof message === "string" && message.includes("exists")) {
          toast.error("User already exists. Try login.");
        } else {
          toast.error(message || "Register failed");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Register failed");
      }
    }
  };

  return (
    <div className={css.card}>
      <h1 className={css.title}>Register</h1>
      <p className={css.text}>
        To start using our services, please fill out the registration form below. All fields are mandatory:
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <div className={css.field}>
          <input
            className={css.input}
            type="text"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <p className={css.error}>{errors.name.message}</p>}
        </div>

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
                href={`/sprite.svg#${showPassword ? "icon-eye-off-2" : "icon-eye-2"}`}
              />
            </svg>
          </button>
          {errors.password && <p className={css.error}>{errors.password.message}</p>}
        </div>

        <button type="submit" className={css.button}>
          Register
        </button>
      </form>

      <p className={css.text}>
        <Link href="/login" className={css.link}>
          Login
        </Link>
      </p>
    </div>
  );
}