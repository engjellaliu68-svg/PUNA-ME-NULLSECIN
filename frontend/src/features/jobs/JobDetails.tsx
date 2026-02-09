"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fetchJob, type JobDetails as JobDetailsType } from "@/services/jobsService";

type JobDetailsProps = {
  jobId: string;
};

export function JobDetails({ jobId }: JobDetailsProps) {
  const [job, setJob] = useState<JobDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchJob(jobId)
      .then((data) => {
        if (active) {
          setJob(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load job");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [jobId]);

  const budget = (() => {
    const min = job?.budgetMin ?? null;
    const max = job?.budgetMax ?? null;
    if (min && max) {
      return `${min} - ${max} EUR`;
    }
    if (min) {
      return `From ${min} EUR`;
    }
    if (max) {
      return `Up to ${max} EUR`;
    }
    return "Budget not set";
  })();

  const meta = [job?.city ?? "Remote", budget, job?.locationType].filter(Boolean).join(" · ");

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[30px] border border-black/5 bg-white/85 p-8 shadow-2xl animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          {job?.category?.name ?? "Category"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">
          {loading ? "Loading..." : job?.title ?? "Job"}
        </h1>
        <p className="mt-2 text-sm text-black/60">{meta}</p>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <p className="mt-6 text-base text-black/70">{job?.description ?? ""}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Status", value: job?.status ?? "" },
            { label: "Location", value: job?.locationType ?? "" },
            { label: "City", value: job?.city ?? "Remote" },
            { label: "Offers", value: job?.offers?.length?.toString() ?? "0" }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-black/5 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-black/5 bg-sand/70 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">Deliverables</p>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>Scope details and milestones will appear here once provided.</li>
          </ul>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-xl animate-fade-up delay-1">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Budget</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{budget}</p>
          <p className="mt-2 text-sm text-black/60">Payment aligned with milestones.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Send offer</Button>
            <Button variant="secondary">Message requester</Button>
          </div>
        </div>
        <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-sm animate-fade-up delay-2">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Client</p>
          <h3 className="mt-3 text-lg font-semibold text-ink">{job?.user?.email ?? "Client"}</h3>
          <p className="mt-2 text-sm text-black/60">Job owner</p>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-black/70">
            Prefers chat before sending offers.
          </div>
        </div>
      </aside>
    </section>
  );
}
