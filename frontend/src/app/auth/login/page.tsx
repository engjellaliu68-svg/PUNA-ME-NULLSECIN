"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { accessToken } = await login(email, password);
      localStorage.setItem("pj_token", accessToken);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-2xl animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">Sign in</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-black/60">Log in to manage your requests and offers.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
          />
          <input
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Log in"}
          </Button>
        </form>
        <div className="mt-6 grid gap-3">
          <a
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 delay-1"
            href={`${apiUrl}/auth/google`}
          >
            Continue with Google
          </a>
          <a
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 delay-2"
            href={`${apiUrl}/auth/facebook`}
          >
            Continue with Facebook
          </a>
        </div>
        <p className="mt-6 text-sm">
          New here?{" "}
          <Link className="text-accent" href="/auth/register">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
