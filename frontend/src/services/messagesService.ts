import { apiFetch } from "./api";
import type { Message } from "@puna-jote/shared";

export function fetchThreads() {
  return apiFetch<Message[]>("/messages/threads");
}

export function fetchThreadMessages(jobId: string) {
  return apiFetch<Message[]>(`/messages/threads/${jobId}`);
}

export function sendMessage(payload: { jobId: string; receiverId: string; content: string }) {
  return apiFetch<Message>("/messages/send", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
