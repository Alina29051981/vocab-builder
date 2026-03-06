"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/lib/validation/registerSchema";
import { register } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

 const onSubmit = async (data: FormValues) => {
  try {
    await register(data);

    toast.success("Successfully registered");

    router.push("/dictionary");
    router.refresh();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } else {
      toast.error("Something went wrong");
    }
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...formRegister("name")}
        placeholder="Name"
      />
      <p>{errors.name?.message}</p>

      <input
        {...formRegister("email")}
        placeholder="Email"
      />
      <p>{errors.email?.message}</p>

      <input
        type={showPassword ? "text" : "password"}
        {...formRegister("password")}
        placeholder="Password"
      />

      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
      >
        <svg className="icon icon-eye-2"><use href="#icon-eye-2"></use></svg>
      </button>

      <p>{errors.password?.message}</p>

      <button type="submit">
        Register
      </button>
    </form>
  );
}