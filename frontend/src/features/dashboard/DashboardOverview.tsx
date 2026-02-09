"use client";

import { useEffect, useMemo, useState } from "react";
import type { Message } from "@puna-jote/shared";
import { fetchJobs, type JobListItem } from "@/services/jobsService";
import { fetchThreads } from "@/services/messagesService";
import { fetchMe } from "@/services/usersService";

const quickActions = ["Create a new job request", "Review active offers", "Update your service profile"];

export function DashboardOverview() {
  const [userId, setUserId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [threads, setThreads] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchMe(), fetchJobs(), fetchThreads()])
      .then(([me, jobList, threadMessages]) => {
        if (!active) return;
        setUserId(me.id);
        setJobs(jobList);
        setThreads(threadMessages);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const unread = userId
      ? threads.filter((message) => message.status === "SENT" && message.receiverId === userId).length
      : 0;
    return [
      { label: "Jobs available", value: jobs.length, note: "Latest opportunities" },
      { label: "Messages", value: threads.length, note: "Active threads" },
      { label: "Unread messages", value: unread, note: "Needs attention" }
    ];
  }, [jobs, threads]);

  const hasActivity = stats.some((item) => item.value > 0);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-2xl animate-fade-up">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-coral/30 to-ocean/20 blur-3xl"
        aria-hidden
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Your command center</h1>
          <p className="mt-3 text-sm text-black/60">
            Track active requests, incoming offers, and the conversations moving today forward.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-ink">{loading ? "-" : item.value}</p>
                <p className="mt-2 text-xs text-black/50">{item.note}</p>
              </div>
            ))}
          </div>
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : !hasActivity && !loading ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-4 text-sm text-black/60">
              No activity yet. Create your first request to start receiving offers.
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Quick actions</p>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <div
                key={action}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-black/70 transition hover:-translate-y-0.5 hover:border-accent"
              >
                <span>{action}</span>
                <span className="text-xs font-semibold text-accent">Open</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
