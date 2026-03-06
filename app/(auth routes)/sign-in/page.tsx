import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>

      <LoginForm />

     <p>Don&apos;t have an account?{" "}
        <Link href="/register">Register</Link>
      </p>
    </main>
  );
}