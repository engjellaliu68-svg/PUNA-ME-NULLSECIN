"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchJobs, type JobListItem } from "@/services/jobsService";

const defaultCategories = ["All", "Design", "Home repairs", "Tech", "Education", "Events"];

const formatBudget = (job: JobListItem) => {
  const min = job.budgetMin ?? null;
  const max = job.budgetMax ?? null;
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
};

export function JobList() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchJobs()
      .then((data) => {
        if (active) {
          setJobs(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load jobs");
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
  }, []);

  const hasJobs = jobs.length > 0;
  const categories = useMemo(() => {
    const names = new Set<string>();
    jobs.forEach((job) => {
      if (job.category?.name) {
        names.add(job.category.name);
      }
    });
    return names.size ? ["All", ...Array.from(names)] : defaultCategories;
  }, [jobs]);

  return (
    <section className="space-y-8">
      <div className="rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-2xl animate-fade-up">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">Marketplace</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">Job listings</h1>
            <p className="mt-2 text-sm text-black/60">Browse the latest requests across Kosovo.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm transition hover:-translate-y-0.5"
          >
            Post a request
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-semibold text-black/70"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-xl border border-black/10 bg-white/90 px-4 py-3 text-sm"
            placeholder="Search jobs, skills, or locations"
          />
          <button className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-ink">
            Filters
          </button>
        </div>
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-black/60">
            <span>{jobs.length} opportunities</span>
            <span>Sorted by newest</span>
          </div>
          {loading ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-6 text-sm text-black/60">
              Loading jobs...
            </div>
          ) : hasJobs ? (
            jobs.map((job, index) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className={`block rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg animate-fade-up delay-${index + 1}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                      {job.category?.name ?? "General"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-ink">{job.title}</h2>
                    <p className="mt-2 text-sm text-black/60">
                      {job.city ?? "Remote"} · {formatBudget(job)}
                    </p>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    {job.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-6 text-sm text-black/60">
              No jobs yet. Try adjusting your filters or check back later.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm animate-fade-up delay-2">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">Match score</p>
            <h3 className="mt-3 text-lg font-semibold text-ink">Boost your visibility</h3>
            <p className="mt-2 text-sm text-black/60">
              Complete your profile and respond to offers to appear higher in search.
            </p>
            <div className="mt-4 rounded-2xl bg-sand/70 px-4 py-3 text-sm text-black/70">
              Profile completeness: <span className="font-semibold text-ink">72%</span>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm animate-fade-up delay-3">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">Trending</p>
            <h3 className="mt-3 text-lg font-semibold text-ink">Popular skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["WordPress", "Painting", "Logo design", "Catering", "React"].map((skill) => (
                <span key={skill} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black/60">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
