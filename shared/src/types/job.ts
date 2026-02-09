export enum JobStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum JobLocationType {
  ONLINE = "ONLINE",
  ONSITE = "ONSITE",
  HYBRID = "HYBRID"
}

export type Job = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  city?: string;
  locationType: JobLocationType;
  budgetMin?: number;
  budgetMax?: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};
