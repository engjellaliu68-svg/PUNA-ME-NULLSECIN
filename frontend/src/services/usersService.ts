import { apiFetch } from "./api";
import type { Profile, User } from "@puna-jote/shared";

export type UserWithProfile = User & { profile: Profile | null };

export function fetchMe() {
  return apiFetch<UserWithProfile>("/users/me");
}
