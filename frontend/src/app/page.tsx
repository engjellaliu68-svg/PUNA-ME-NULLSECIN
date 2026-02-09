import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const stats = [
    { label: "Jobs posted", value: "1.2k+" },
    { label: "Avg. response", value: "22 min" },
    { label: "Repeat clients", value: "68%" }
  ];

  const highlights = [
    {
      title: "Post requests",
      copy: "Describe the job, set budget, receive curated offers fast."
    },
    {
      title: "Offer services",
      copy: "Send proposals, share availability, and chat instantly."
    },
    {
      title: "Build trust",
      copy: "Ratings, reviews, and verified profiles keep quality high."
    }
  ];

  const categories = ["Home repairs", "Design & brand", "Delivery", "Tutoring", "Events", "Tech setup"];

  return (
    <main className="relative min-h-screen px-6 pb-20 pt-10">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-coral/40 via-sun/40 to-ocean/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-6 top-32 hidden h-56 w-56 rounded-full bg-gradient-to-br from-accent/40 to-ocean/20 blur-3xl md:block"
        aria-hidden
      />

      <section className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative animate-fade-up">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">PUNA JOTE</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Find trusted help.
              <span className="block text-accent">Offer your skills.</span>
              Build local trust.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-black/70">
              The platform connecting Kosovo job requests with verified professionals, ready to expand
              globally.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button variant="primary">Get started</Button>
              </Link>
              <Link href="/jobs">
                <Button variant="secondary">Browse jobs</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {stats.map((item) => (
                <div key={item.label} className="min-w-[140px]">
                  <p className="text-2xl font-semibold text-ink">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up delay-1">
            <div className="float-soft absolute -top-6 right-6 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-ink shadow-lg">
              Live opportunities
            </div>
            <div className="rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Opportunity board</p>
                  <p className="text-xs text-black/50">Updated minutes ago</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">New</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { title: "Kitchen repaint", price: "120 EUR", tag: "Home repairs" },
                  { title: "Logo refresh", price: "180 EUR", tag: "Design" },
                  { title: "Website audit", price: "250 EUR", tag: "Tech" }
                ].map((job) => (
                  <div
                    key={job.title}
                    className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{job.title}</p>
                        <p className="text-xs text-black/50">{job.tag}</p>
                      </div>
                      <p className="text-xs font-semibold text-accent">{job.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-black/5 bg-gradient-to-br from-sand via-white to-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-black/50">Best match</p>
                <p className="mt-2 text-sm font-semibold text-ink">Verified electrician needed today</p>
                <div className="mt-3 flex items-center justify-between text-xs text-black/50">
                  <span>Prishtina</span>
                  <span>4 offers waiting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg animate-fade-up"
            >
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-black/70">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-xl animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-black/50">Categories</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Everything your neighborhood needs</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-semibold text-black/70 transition hover:-translate-y-0.5 hover:border-accent"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl rounded-[30px] bg-ink px-10 py-12 text-white shadow-2xl">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Grow with Puna Jote</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Launch your next job or find your next client in minutes.
            </h2>
            <p className="mt-4 text-sm text-white/70">
              One profile. Instant chat. Payments aligned with milestones.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register">
              <Button variant="dark" className="bg-white text-ink hover:bg-white/90">
                Create account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="ghost" className="border border-white/40 text-white">
                Explore jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
