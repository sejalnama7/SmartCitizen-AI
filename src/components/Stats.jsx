import { memo, useEffect, useRef, useState } from "react";

/**
 * Dashboard overview metrics. Static numbers for now — swap `statsData`
 * for a fetch from services/statsService once the backend is live. Shape
 * is intentionally kept flat so an API response can map onto it directly.
 */
const statsData = [
  {
    id: "total",
    label: "Total Complaints",
    value: 12480,
    suffix: "+",
    accent: "slate",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="13" rx="2" strokeWidth="1.7" />
        <path d="M4 11h16M8 3.5v3M16 3.5v3" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "pending",
    label: "Pending",
    value: 2140,
    suffix: "",
    accent: "amber",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" strokeWidth="1.7" />
        <path d="M12 7.5V12l2.6 1.6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "resolved",
    label: "Resolved",
    value: 9860,
    suffix: "+",
    accent: "emerald",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" strokeWidth="1.7" />
        <path d="M8.3 12.3l2.4 2.4 5-5.2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "high-priority",
    label: "High Priority",
    value: 312,
    suffix: "",
    accent: "rose",
    icon: (
      <>
        <path
          d="M12 4.2l8.5 14.7a1 1 0 0 1-.87 1.5H4.37a1 1 0 0 1-.87-1.5L12 4.2Z"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M12 10v4M12 16.8v.01" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "emergency",
    label: "Emergency Requests",
    value: 128,
    suffix: "",
    accent: "sky",
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
];

const accentStyles = {
  slate: "bg-slate-50 text-slate-600 ring-slate-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
};

/** Eases toward the target value; snaps instantly if motion is reduced. */
function useCountUp(targets, shouldStart) {
  const [values, setValues] = useState(() => targets.map(() => 0));
  const frameRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return undefined;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setValues(targets);
      return undefined;
    }

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic

      setValues(targets.map((target) => Math.round(target * eased)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // targets are static per mount; only re-run when the trigger flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStart]);

  return values;
}

function StatCard({ stat, displayValue }) {
  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-6",
        "shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]",
      ].join(" ")}
    >
      <div
        className={[
          "inline-flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset",
          accentStyles[stat.accent],
        ].join(" ")}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className="h-5.5 w-5.5"
        >
          {stat.icon}
        </svg>
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums sm:text-3xl">
          {displayValue.toLocaleString()}
          {stat.suffix}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
          {stat.label}
        </p>
      </div>
    </div>
  );
}

function Stats({ data = statsData }) {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const targets = data.map((stat) => stat.value);
  const animatedValues = useCountUp(targets, hasEntered);

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      aria-labelledby="dashboard-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-slate-50/60 py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              Live Operations
            </div>

            <h2
              id="dashboard-heading"
              className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
            >
              The platform{" "}
              <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
                at a glance
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Every report, from submission to resolution, rolled up into
            numbers authorities can act on in real time.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-5">
          {data.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} displayValue={animatedValues[index] ?? 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Stats);