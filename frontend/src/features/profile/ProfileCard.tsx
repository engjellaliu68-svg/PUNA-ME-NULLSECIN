export function ProfileCard() {
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-black/5 bg-white/85 p-8 shadow-2xl animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Arta K.</h1>
        <p className="mt-2 text-sm text-black/60">Provider · Pristina, Kosovo</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Jobs completed", value: "12" },
            { label: "Rating", value: "4.9" },
            { label: "Repeat clients", value: "68%" }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-black/5 bg-white/85 p-6 shadow-xl animate-fade-up delay-1">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">About</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">Bio & expertise</h2>
          <p className="mt-3 text-sm text-black/70">
            Specializing in brand identities and web experiences for local businesses.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Branding", "UI design", "WordPress", "Photography"].map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black/60">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white/85 p-6 shadow-xl animate-fade-up delay-2">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Settings</p>
          <div className="mt-4 space-y-3 text-sm text-black/70">
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3">
              <span>Profile visibility</span>
              <span className="text-xs font-semibold text-accent">Public</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3">
              <span>Notifications</span>
              <span className="text-xs font-semibold text-accent">On</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3">
              <span>Payments</span>
              <span className="text-xs font-semibold text-accent">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
