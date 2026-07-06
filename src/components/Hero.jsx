import { memo } from "react";
import "./HeroPremium.css";

const heroHighlights = [
  "Real-time civic intelligence",
  "AI-assisted issue triage",
  "Clean municipal operations",
];

const issueCards = [
  {
    id: "garbage",
    title: "Garbage Overflow",
    status: "Reported",
    statusClass: "bg-amber-50 text-amber-700 ring-amber-200",
    category: "Sanitation",
    image: "/garbage.jpg",
    alt: "Overflowing garbage issue detected in a civic area",
  },
  {
    id: "ambulance",
    title: "Ambulance Delay",
    status: "In Transit",
    statusClass: "bg-sky-50 text-sky-700 ring-sky-200",
    category: "Healthcare",
    image: "/ambulance.jpg",
    alt: "Ambulance response issue for emergency support",
  },
  {
    id: "fire",
    title: "Fire Alert",
    status: "Critical",
    statusClass: "bg-rose-50 text-rose-700 ring-rose-200",
    category: "Safety",
    image: "/fire.jpg",
    alt: "Fire incident alert requiring immediate attention",
  },
  {
    id: "water",
    title: "Water Leakage",
    status: "Assigned",
    statusClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    category: "Utilities",
    image: "/water.jpg",
    alt: "Water supply leakage in the public infrastructure network",
  },
  {
    id: "pothole",
    title: "Road Pothole",
    status: "Under Review",
    statusClass: "bg-violet-50 text-violet-700 ring-violet-200",
    category: "Infrastructure",
    image: "/pothole.jpg",
    alt: "Damaged road surface with pothole requiring repair",
  },
];

const marqueeCards = [...issueCards, ...issueCards];

function HeroIssueCard({ item, duplicated = false }) {
  return (
    <article
      className={[
        "group relative flex w-[min(84vw,20rem)] shrink-0 flex-col overflow-hidden rounded-[1.75rem]",
        "border border-white/70 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]",
      ].join(" ")}
      aria-hidden={duplicated}
    >
      <div className="relative aspect-16/11 overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`}
          alt={item.alt}
          loading={duplicated ? "lazy" : "eager"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-white/5" />
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 sm:px-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em]",
              "uppercase text-slate-700 ring-1 ring-inset ring-white/70 backdrop-blur-md",
              "bg-white/75 shadow-sm",
            ].join(" ")}
          >
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-w-0 flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 md:text-xl wrap-break-word">
              {item.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-500 wrap-break-word">
              AI prioritization, dispatch readiness, and civic response tracking in one place.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 sm:px-3 text-[11px] sm:text-xs font-semibold ring-1 ring-inset",
              item.statusClass,
            ].join(" ")}
          >
            {item.status}
          </span>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 sm:px-3 text-[11px] sm:text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
            Live Issue
          </span>
        </div>

        <div className="mt-auto pt-2">
          <button
            type="button"
            tabIndex={duplicated ? -1 : 0}
            aria-label={`View details for ${item.title}`}
            className={[
              "inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold",
              "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]",
              "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
              duplicated ? "pointer-events-none" : "",
            ].join(" ")}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function HeroPremium() {
  const scrollToSection = (id) => {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
  return (
    
    <section
      id="smartcitizen-ai"
      aria-labelledby="smartcitizen-ai-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden overflow-y-visible bg-white text-slate-900"
    >
      {/* Soft background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-56 w-56 sm:h-80 sm:w-80 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute right-0 top-20 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute right-16 bottom-14 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-linear(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),radial-linear(circle_at_top_right,rgba(59,130,246,0.11),transparent_26%),linear-linear(to_bottom,rgba(255,255,255,0.92),rgba(255,255,255,1))]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Left Content */}
          <div className="relative z-10 min-w-0 w-full lg:col-span-5 xl:col-span-5">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
              <span className="wrap-break-word">AI Powered Smart Governance</span>
            </div>

            <h1
              id="smartcitizen-ai-heading"
              className="mt-6 max-w-xl wrap-break-word text-center lg:text-left text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-tight tracking-[-0.02em] sm:tracking-[-0.04em]"
            >
              <span className="text-slate-900">
                Smart
              </span>

              <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
                Citizen
              </span>

              <span className="ml-2 bg-linear-to-r from-blue-600 via-cyan-500 to-sky-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 md:text-lg xl:text-xl">
              A civic intelligence platform that detects public issues, prioritizes
              response workflows, and helps governments deliver faster, smarter, and more
              transparent services.
            </p>

            <div className="mt-8 flex max-w-xl flex-wrap gap-2 sm:gap-3">
              {heroHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="inline-flex max-w-full items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                >
                  <span className="wrap-break-word">{highlight}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex max-w-xl flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
              <button
                type="button" onClick={() => scrollToSection("report-issue")}
                className={[
                  "inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-6 py-3 sm:py-3.5 text-sm font-semibold",
                  "bg-sky-600 text-white shadow-[0_16px_40px_rgba(2,132,199,0.26)]",
                  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-sky-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                Explore Now
              </button>

              <button
                type="button" onClick={() => scrollToSection("features")}
                className={[
                  "inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-6 py-3 sm:py-3.5",
                  "text-sm font-semibold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl",
                  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative z-10 min-w-0 w-full max-w-full self-start lg:col-span-7 xl:col-span-7">
            <div className="hero-marquee hero-marquee-mask relative w-full max-w-full overflow-hidden">
              <div className="mb-4 sm:mb-5 flex items-end justify-between gap-4 px-1">
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.24em] text-cyan-700">
                    Live Civic Feed
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl sm:rounded-4xl border border-white/70 bg-white/35 p-3 sm:p-4 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
                <div className="hero-marquee-track flex w-max items-stretch">
                  <div className="hero-marquee-group flex items-stretch gap-4 sm:gap-6 pr-4 sm:pr-6">
                    {issueCards.map((item) => (
                      <HeroIssueCard key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="hero-marquee-group flex items-stretch gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
                    {marqueeCards.map((item, index) => (
                      <HeroIssueCard
                        key={`${item.id}-clone-${index}`}
                        item={item}
                        duplicated
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroPremium);