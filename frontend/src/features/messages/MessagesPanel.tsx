"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Message } from "@puna-jote/shared";
import { fetchThreads, fetchThreadMessages, sendMessage } from "@/services/messagesService";
import { fetchMe, type UserWithProfile } from "@/services/usersService";
import { getAccessToken } from "@/services/api";
import { refreshAccessToken } from "@/services/authService";

type ThreadSummary = {
  jobId: string;
  lastMessage: string;
  lastAt: string;
  unreadCount: number;
};

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
if (!socketUrl) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SOCKET_URL");
}

const buildThreads = (messages: Message[], userId: string) => {
  const byJob = new Map<string, Message[]>();
  messages.forEach((message) => {
    const existing = byJob.get(message.jobId) ?? [];
    existing.push(message);
    byJob.set(message.jobId, existing);
  });

  const summaries: ThreadSummary[] = [];
  byJob.forEach((threadMessages, jobId) => {
    const sorted = [...threadMessages].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    const last = sorted[0];
    const unreadCount = threadMessages.filter(
      (message) => message.receiverId === userId && message.status === "SENT"
    ).length;
    summaries.push({
      jobId,
      lastMessage: last.content,
      lastAt: last.createdAt,
      unreadCount
    });
  });

  return summaries.sort((a, b) => (a.lastAt > b.lastAt ? -1 : 1));
};

const upsertThread = (threads: ThreadSummary[], message: Message, userId: string) => {
  const index = threads.findIndex((thread) => thread.jobId === message.jobId);
  const unreadDelta = message.receiverId === userId && message.status === "SENT" ? 1 : 0;
  if (index >= 0) {
    const updated = [...threads];
    const existing = updated[index];
    updated[index] = {
      jobId: message.jobId,
      lastMessage: message.content,
      lastAt: message.createdAt,
      unreadCount: existing.unreadCount + unreadDelta
    };
    return updated.sort((a, b) => (a.lastAt > b.lastAt ? -1 : 1));
  }

  return [
    {
      jobId: message.jobId,
      lastMessage: message.content,
      lastAt: message.createdAt,
      unreadCount: unreadDelta
    },
    ...threads
  ];
};

export function MessagesPanel() {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchMe(), fetchThreads()])
      .then(([me, threadMessages]) => {
        if (!active) return;
        setUser(me);
        const nextThreads = buildThreads(threadMessages, me.id);
        setThreads(nextThreads);
        setSelectedJobId(nextThreads[0]?.jobId ?? null);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load messages");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !selectedJobId) {
      setMessages([]);
      return;
    }

    let active = true;
    fetchThreadMessages(selectedJobId)
      .then((data: Message[]) => {
        if (active) {
          setMessages(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load thread");
        }
      });

    return () => {
      active = false;
    };
  }, [selectedJobId, user]);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const connect = async () => {
      let token = getAccessToken();
      if (!token) {
        token = (await refreshAccessToken()) ?? null;
      }
      if (!active) return;

      const socket: Socket = io(socketUrl, {
        transports: ["websocket"],
        auth: { token: token ?? undefined }
      });
      socketRef.current = socket;

      socket.on("message:new", (message: Message) => {
        setThreads((current) => upsertThread(current, message, user.id));
        setMessages((current) => {
          if (message.jobId !== selectedJobId) {
            return current;
          }
          return [...current, message];
        });
      });
    };

    connect();

    return () => {
      active = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [selectedJobId, user]);

  const hasThreads = threads.length > 0;
  const activeThread = useMemo(
    () => threads.find((thread) => thread.jobId === selectedJobId) ?? null,
    [threads, selectedJobId]
  );

  const receiverId = useMemo(() => {
    if (!user || messages.length === 0) return null;
    const last = messages[messages.length - 1];
    return last.senderId === user.id ? last.receiverId : last.senderId;
  }, [messages, user]);

  const handleSend = async () => {
    if (!user || !selectedJobId || !receiverId || !messageInput.trim()) {
      return;
    }

    const payload = {
      jobId: selectedJobId,
      receiverId,
      content: messageInput.trim()
    };

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("message:send", payload, (message: Message) => {
        setMessages((current) => [...current, message]);
        setThreads((current) => upsertThread(current, message, user.id));
        setMessageInput("");
      });
      return;
    }

    try {
      const message = await sendMessage({
        jobId: payload.jobId,
        receiverId: payload.receiverId,
        content: payload.content
      });
      setMessages((current) => [...current, message]);
      setThreads((current) => upsertThread(current, message, user.id));
      setMessageInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-black/5 bg-white/85 p-6 shadow-xl animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">Inbox</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Messages</h1>
          </div>
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            {threads.length} threads
          </span>
        </div>
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-4 text-sm text-black/60">
              Loading threads...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : hasThreads ? (
            threads.map((thread) => (
              <button
                key={thread.jobId}
                type="button"
                onClick={() => setSelectedJobId(thread.jobId)}
                className={`flex w-full items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  thread.jobId === selectedJobId ? "shadow-md" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">Job {thread.jobId.slice(0, 6)}</p>
                  <p className="text-xs text-black/60 line-clamp-1">{thread.lastMessage}</p>
                </div>
                <div className="text-right text-xs text-black/50">
                  <p>{new Date(thread.lastAt).toLocaleDateString()}</p>
                  {thread.unreadCount > 0 ? (
                    <span className="mt-2 inline-block rounded-full bg-coral/20 px-2 py-0.5 text-[10px] font-semibold text-coral">
                      {thread.unreadCount} new
                    </span>
                  ) : null}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-4 text-sm text-black/60">
              No messages yet. Start a conversation from a job offer.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-black/5 bg-white/85 p-6 shadow-xl animate-fade-up delay-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">Preview</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {activeThread ? `Job ${activeThread.jobId.slice(0, 6)}` : "Select a thread"}
            </h2>
          </div>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-ink">
            {activeThread ? "Active" : "Idle"}
          </span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-black/70">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-3 text-sm text-black/60">
              No messages in this thread yet.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl border border-black/5 px-4 py-3 ${
                  message.senderId === user?.id ? "bg-ink text-white" : "bg-white"
                }`}
              >
                {message.content}
              </div>
            ))
          )}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            placeholder="Write a message..."
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
          />
          <button
            className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            onClick={handleSend}
            disabled={!receiverId || !selectedJobId || !messageInput.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
