"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("pj_token", token);
    }
    router.replace("/dashboard");
  }, [router, searchParams]);

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Signing you in...</h1>
      <p className="mt-2 text-sm text-black/60">Please wait while we finalize your session.</p>
    </main>
  );
}
