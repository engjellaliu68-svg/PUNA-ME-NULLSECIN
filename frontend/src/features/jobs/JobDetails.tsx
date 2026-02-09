import { Button } from "@/components/ui/Button";

export function JobDetails() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[30px] border border-black/5 bg-white/85 p-8 shadow-2xl animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">Design</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Website redesign for local bakery</h1>
        <p className="mt-2 text-sm text-black/60">Pristina · 250 - 400 EUR · Online/Hybrid</p>
        <p className="mt-6 text-base text-black/70">
          Looking for a modern redesign with online ordering capabilities and a friendly aesthetic.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Timeline", value: "2 weeks" },
            { label: "Experience", value: "Mid-level" },
            { label: "Client type", value: "Local business" },
            { label: "Location", value: "Hybrid" }
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
            <li>Responsive redesign for landing and menu pages</li>
            <li>Online ordering flow setup</li>
            <li>Brand refresh with warm photography direction</li>
          </ul>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-xl animate-fade-up delay-1">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Budget</p>
          <p className="mt-3 text-3xl font-semibold text-ink">250 - 400 EUR</p>
          <p className="mt-2 text-sm text-black/60">Payment aligned with milestones.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Send offer</Button>
            <Button variant="secondary">Message requester</Button>
          </div>
        </div>
        <div className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-sm animate-fade-up delay-2">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">Client</p>
          <h3 className="mt-3 text-lg font-semibold text-ink">Arta K.</h3>
          <p className="mt-2 text-sm text-black/60">4 jobs posted · 92% response rate</p>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-black/70">
            Prefers chat before sending offers.
          </div>
        </div>
      </aside>
    </section>
  );
}
