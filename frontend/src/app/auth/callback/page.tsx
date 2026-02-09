"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/services/authService";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    refreshAccessToken()
      .catch(() => null)
      .finally(() => {
        router.replace("/dashboard");
      });
  }, [router]);

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Signing you in...</h1>
      <p className="mt-2 text-sm text-black/60">Please wait while we finalize your session.</p>
    </main>
  );
}
