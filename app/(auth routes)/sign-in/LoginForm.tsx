"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validation/loginSchema";
import { login } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
  });

  // ✅ ТІЛЬКИ ЛОГІКА
  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      await login(data);

      toast.success("Successfully logged in");

      router.push("/dictionary");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Request failed"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ✅ JSX ТУТ
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input
        type={showPassword ? "text" : "password"}
        {...register("password")}
        placeholder="Password"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
      >
       <svg className="icon icon-eye-2"><use href="#icon-eye-2"></use></svg>
      </button>

      <p>{errors.password?.message}</p>

      <button type="submit">Log in</button>
    </form>
  );
}