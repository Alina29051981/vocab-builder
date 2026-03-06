import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./loginSchema";

const LoginForm = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      ...
    </form>
  );
};