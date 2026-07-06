import { memo } from "react";

/**
 * The four-stage complaint lifecycle. Order is meaningful here (unlike the
 * Features grid), so numbered steps are appropriate.
 */
const steps = [
  {
    number: "01",
    title: "Citizen reports issue",
    description:
      "Snap a photo, drop a pin, pick a category, and submit — takes under a minute from a phone.",
    icon: (
      <>
        <path
          d="M12 21s7-6.2 7-11.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.6" strokeWidth="1.8" />
      </>
    ),
  },
  {
    number: "02",
    title: "AI analyses complaint",
    description:
      "The system reads the report, classifies its category, and scores urgency based on risk and location.",
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
    number: "03",
    title: "Authority receives complaint",
    description:
      "The right department is notified instantly, with priority reports flagged at the top of their queue.",
    icon: (
      <>
        <path d="M5 21V9.5L12 4l7 5.5V21" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M9 21v-6h6v6" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      </>
    ),
  },
  {
    number: "04",
    title: "Issue resolved",
    description:
      "The citizen gets a status update at every stage, closing the loop the moment the issue is fixed.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" strokeWidth="1.8" />
        <path d="M8.3 12.3l2.4 2.4 5-5.2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

function StepIcon({ children }) {
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

function StepMarker({ number, icon }) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)]">
        <StepIcon>{icon}</StepIcon>
      </div>
      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-[0_4px_10px_rgba(15,23,42,0.15)] ring-1 ring-slate-200">
        {number}
      </span>
    </div>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            How It Works
          </div>

          <h2
            id="how-it-works-heading"
            className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            From report to{" "}
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              resolution
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Four steps take a citizen's report from a phone screen to a
            resolved issue — with visibility at every stage along the way.
          </p>
        </div>

        {/* Timeline */}
        <ol className="relative mt-14 sm:mt-16 lg:mt-20">
          {/* Connecting line — vertical on mobile/tablet, horizontal on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-0.5 bg-linear-to-b from-cyan-200 via-sky-300 to-blue-300 lg:hidden"
          />
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-linear-to-r from-cyan-200 via-sky-300 to-blue-300 lg:block"
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-6">
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative flex gap-5 lg:flex-1 lg:flex-col lg:items-center lg:gap-5 lg:text-center"
              >
                <StepMarker number={step.number} icon={step.icon} />

                <div className="min-w-0 pt-1 lg:pt-0">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:mx-auto">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}

export default memo(HowItWorks);