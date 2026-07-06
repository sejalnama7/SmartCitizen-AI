import { memo } from "react";

/**
 * Feature catalogue. Each icon is a small inline SVG so the section stays
 * dependency-free — no icon package required.
 */
const features = [
  {
    id: "report-civic-issues",
    title: "Report Civic Issues",
    description:
      "Snap a photo, drop a pin, and file a complaint in under a minute — no forms buried in bureaucracy.",
    accent: "cyan",
    icon: (
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    id: "track-complaint-status",
    title: "Track Complaint Status",
    description:
      "Follow every report from submitted to resolved with live status updates — no more calling the office to ask.",
    accent: "sky",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "ai-smart-assistant",
    title: "AI Smart Assistant",
    description:
      "Ask questions in plain language and get instant guidance on services, deadlines, and next steps.",
    accent: "blue",
    icon: (
      <>
        <path
          d="M12 3.5l1.7 3.8 3.8 1.7-3.8 1.7L12 14.5l-1.7-3.8-3.8-1.7 3.8-1.7L12 3.5Z"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M18.5 15l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2Z" strokeWidth="1.4" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "emergency-services",
    title: "Emergency Services",
    description:
      "One tap connects citizens to ambulance, police, fire, and disaster response — routed with priority.",
    accent: "cyan",
    icon: (
      <>
        <path
          d="M12 4.5c-3.5 0-6.5 2.8-6.5 6.8 0 4.6 6.5 8.7 6.5 8.7s6.5-4.1 6.5-8.7c0-4-3-6.8-6.5-6.8Z"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M12 8.5v5M9.5 11h5" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "smart-dashboard",
    title: "Smart Dashboard",
    description:
      "Authorities see complaint volume, priority, and resolution rates at a glance, updated in real time.",
    accent: "sky",
    icon: (
      <>
        <rect x="4.5" y="13" width="3.2" height="6.5" rx="0.8" strokeWidth="1.6" />
        <rect x="10.4" y="8.5" width="3.2" height="11" rx="0.8" strokeWidth="1.6" />
        <rect x="16.3" y="4.5" width="3.2" height="15" rx="0.8" strokeWidth="1.6" />
      </>
    ),
  },
  {
    id: "community-engagement",
    title: "Community Engagement",
    description:
      "Citizens upvote local issues and follow neighborhood activity, giving authorities a clear signal on priority.",
    accent: "blue",
    icon: (
      <>
        <circle cx="8.5" cy="9" r="2.4" strokeWidth="1.7" />
        <circle cx="16" cy="9" r="2.1" strokeWidth="1.7" />
        <path
          d="M4 19c0-2.8 2-4.8 4.5-4.8S13 16.2 13 19M13.3 14.6c2 0 3.7 1.7 3.7 4.4"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

const accentStyles = {
  cyan: {
    iconWrap: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    hoverBorder: "hover:border-cyan-200/80",
    link: "text-cyan-700",
  },
  sky: {
    iconWrap: "bg-sky-50 text-sky-600 ring-sky-100",
    hoverBorder: "hover:border-sky-200/80",
    link: "text-sky-700",
  },
  blue: {
    iconWrap: "bg-blue-50 text-blue-600 ring-blue-100",
    hoverBorder: "hover:border-blue-200/80",
    link: "text-blue-700",
  },
};

function FeatureIcon({ children }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="h-6 w-6"
    >
      {children}
    </svg>
  );
}

function FeatureCard({ feature }) {
  const styles = accentStyles[feature.accent];

  return (
    <article
      className={[
        "group relative flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 sm:p-7",
        "shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]",
        styles.hoverBorder,
      ].join(" ")}
    >
      <div
        className={[
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-300 ease-out group-hover:scale-105",
          styles.iconWrap,
        ].join(" ")}
      >
        <FeatureIcon>{feature.icon}</FeatureIcon>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          {feature.description}
        </p>
      </div>

      <span
        className={[
          "mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold",
          styles.link,
        ].join(" ")}
      >
        Learn more
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          <path
            d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </article>
  );
}

function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* Subtle atmosphere, kept light so it doesn't compete with the Hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(56,189,248,0.06),transparent_35%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            Platform Capabilities
          </div>

          <h2
            id="features-heading"
            className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            Everything a modern{" "}
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              civic platform
            </span>{" "}
            needs
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            From the first report to final resolution, SmartCitizen AI keeps
            citizens informed and authorities coordinated at every step.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Features);