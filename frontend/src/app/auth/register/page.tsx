"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { register } from "@/services/authService";

type ProfileType = "INDIVIDUAL" | "BUSINESS";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("INDIVIDUAL");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { accessToken } = await register({
        email,
        password,
        profileType,
        displayName,
        companyName: profileType === "BUSINESS" ? companyName : undefined
      });
      localStorage.setItem("pj_token", accessToken);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-2xl animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Join PUNA JOTE</h1>
        <p className="mt-2 text-sm text-black/60">Choose the profile that fits your work.</p>
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
            placeholder="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                profileType === "INDIVIDUAL"
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-black/10 bg-white text-black/60"
              }`}
              onClick={() => setProfileType("INDIVIDUAL")}
            >
              Individual
            </button>
            <button
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                profileType === "BUSINESS"
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-black/10 bg-white text-black/60"
              }`}
              onClick={() => setProfileType("BUSINESS")}
            >
              Business
            </button>
          </div>
          {profileType === "BUSINESS" ? (
            <input
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm"
              placeholder="Company name"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
            />
          ) : null}
          <input
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            required
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>
        <div className="mt-6 grid gap-3">
          <a
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 delay-1"
            href={`${apiUrl}/auth/google`}
          >
            Sign up with Google
          </a>
          <a
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 delay-2"
            href={`${apiUrl}/auth/facebook`}
          >
            Sign up with Facebook
          </a>
        </div>
        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <Link className="text-accent" href="/auth/login">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
