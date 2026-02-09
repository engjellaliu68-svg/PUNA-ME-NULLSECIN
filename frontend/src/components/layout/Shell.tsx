import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-[0.18em] text-ink">
            PUNA JOTE
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-black/70 md:flex">
            <Link href="/jobs" className="transition hover:text-accent">
              Jobs
            </Link>
            <Link href="/dashboard" className="transition hover:text-accent">
              Dashboard
            </Link>
            <Link href="/messages" className="transition hover:text-accent">
              Messages
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-black/70 hover:text-ink">
              Sign in
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" className="px-5 py-2 text-xs">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
