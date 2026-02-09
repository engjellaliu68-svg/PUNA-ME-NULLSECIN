const threads = [
  {
    id: "1",
    title: "Bakery website redesign",
    lastMessage: "Can we start next week?",
    time: "2m",
    unread: true
  },
  {
    id: "2",
    title: "Plumbing repair",
    lastMessage: "Thanks, offer accepted.",
    time: "1h",
    unread: false
  },
  {
    id: "3",
    title: "Social media launch pack",
    lastMessage: "Sharing the brief in a second.",
    time: "1d",
    unread: false
  }
];

export function MessagesPanel() {
  const hasThreads = threads.length > 0;

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
          {hasThreads ? (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{thread.title}</p>
                  <p className="text-xs text-black/60">{thread.lastMessage}</p>
                </div>
                <div className="text-right text-xs text-black/50">
                  <p>{thread.time}</p>
                  {thread.unread ? (
                    <span className="mt-2 inline-block rounded-full bg-coral/20 px-2 py-0.5 text-[10px] font-semibold text-coral">
                      New
                    </span>
                  ) : null}
                </div>
              </div>
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
            <h2 className="mt-2 text-2xl font-semibold text-ink">Bakery website redesign</h2>
          </div>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-ink">
            Active
          </span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-black/70">
          <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
            Hi! We can start next week. Are you available for a quick call?
          </div>
          <div className="rounded-2xl border border-black/5 bg-ink px-4 py-3 text-white">
            Yes, I can share availability this afternoon. Want a proposal first?
          </div>
          <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
            A quick proposal would be perfect, thanks!
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            placeholder="Write a message..."
          />
          <button className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white">Send</button>
        </div>
      </div>
    </section>
  );
}
