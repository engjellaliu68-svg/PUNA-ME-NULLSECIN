import { apiFetch } from "./api";
import type { Job } from "@/types/index";

export function fetchJobs() {
  return apiFetch<Job[]>("/jobs");
}

export function fetchJob(id: string) {
  return apiFetch<Job>(`/jobs/${id}`);
}
