import { apiFetch } from "./api";
import type { Job } from "@/types/index";

export type JobListItem = Job & {
  category?: { name: string } | null;
};

export type JobDetails = Job & {
  category?: { name: string } | null;
  user?: { id: string; email: string } | null;
  offers?: Array<{ id: string; status?: string; price?: number }> | null;
};

export function fetchJobs() {
  return apiFetch<JobListItem[]>("/jobs");
}

export function fetchJob(id: string) {
  return apiFetch<JobDetails>(`/jobs/${id}`);
}
