import RegisterForm from "./RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main>
      <h1>Sign up</h1>

      <RegisterForm />

      <p>
        Already have an account?{" "}
        <Link href="/login">Login</Link>
      </p>
    </main>
  );
}