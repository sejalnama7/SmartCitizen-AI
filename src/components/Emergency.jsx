import { memo } from "react";

/**
 * Emergency numbers shown are India's standard helplines. If you're
 * deploying this for another region, this is the only place to update —
 * swap the `number` fields and the disclaimer copy at the bottom of the
 * section.
 */
const emergencyServices = [
  {
    id: "ambulance",
    title: "Ambulance",
    number: "102",
    description: "Medical emergencies, accidents, and urgent health situations.",
    mapsQuery: "hospital near me",
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
  {
    id: "police",
    title: "Police",
    number: "100",
    description: "Crime, safety threats, and law enforcement assistance.",
    mapsQuery: "police station near me",
    accent: "blue",
    icon: (
      <path
        d="M12 3.8l6.5 2.4v5.3c0 4.4-2.7 8-6.5 9.7-3.8-1.7-6.5-5.3-6.5-9.7V6.2L12 3.8Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "fire",
    title: "Fire",
    number: "101",
    description: "Fire outbreaks, rescue operations, and hazardous incidents.",
    mapsQuery: "fire station near me",
    accent: "rose",
    icon: (
      <path
        d="M12 3.5c1 2.2-.5 3.4-1.3 4.6-1 1.4-1.4 2.6-.6 4.1-1.6-.7-2.4-2-2.3-3.6-1.4 1.5-2.1 3.3-2.1 5 0 3.5 2.8 6.4 6.3 6.4s6.3-2.9 6.3-6.4c0-4-2.7-6.9-6.3-10.1Z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "disaster",
    title: "Disaster Management",
    number: "108",
    description: "Natural disasters, large-scale emergencies, and relief coordination.",
    mapsQuery: "disaster management office near me",
    accent: "amber",
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
];

const accentStyles = {
  sky: {
    topBar: "bg-sky-500",
    iconWrap: "bg-sky-50 text-sky-600 ring-sky-100",
    callButton: "bg-sky-600 hover:bg-sky-500 shadow-[0_10px_25px_rgba(2,132,199,0.25)]",
    directionsHover: "hover:border-sky-200 hover:bg-sky-50/80",
  },
  blue: {
    topBar: "bg-blue-500",
    iconWrap: "bg-blue-50 text-blue-600 ring-blue-100",
    callButton: "bg-blue-600 hover:bg-blue-500 shadow-[0_10px_25px_rgba(37,99,235,0.25)]",
    directionsHover: "hover:border-blue-200 hover:bg-blue-50/80",
  },
  rose: {
    topBar: "bg-rose-500",
    iconWrap: "bg-rose-50 text-rose-600 ring-rose-100",
    callButton: "bg-rose-600 hover:bg-rose-500 shadow-[0_10px_25px_rgba(225,29,72,0.25)]",
    directionsHover: "hover:border-rose-200 hover:bg-rose-50/80",
  },
  amber: {
    topBar: "bg-amber-500",
    iconWrap: "bg-amber-50 text-amber-600 ring-amber-100",
    callButton: "bg-amber-600 hover:bg-amber-500 shadow-[0_10px_25px_rgba(217,119,6,0.25)]",
    directionsHover: "hover:border-amber-200 hover:bg-amber-50/80",
  },
};

function ServiceIcon({ children }) {
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

function EmergencyCard({ service }) {
  const styles = accentStyles[service.accent];
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    service.mapsQuery
  )}`;

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl",
        "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]",
      ].join(" ")}
    >
      <div className={["h-1.5 w-full", styles.topBar].join(" ")} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div
            className={[
              "inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-300 ease-out group-hover:scale-105",
              styles.iconWrap,
            ].join(" ")}
          >
            <ServiceIcon>{service.icon}</ServiceIcon>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Dial
            </p>
            <p className="text-2xl font-black tabular-nums tracking-tight text-slate-900 sm:text-3xl">
              {service.number}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {service.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
          <a
            href={`tel:${service.number}`}
            className={[
              "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white",
              "transition-all duration-300 ease-out hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              styles.callButton,
            ].join(" ")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1 1 0 0 1 1-.25c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C10.5 20.5 3.5 13.5 3.5 4.9a1 1 0 0 1 1-1H8a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1l-2 2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            Call Now
          </a>

          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3",
              "text-sm font-semibold text-slate-700 transition-all duration-300 ease-out hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
              styles.directionsHover,
            ].join(" ")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.2 7-11.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}

function Emergency() {
  return (
    <section
      id="emergency"
      aria-labelledby="emergency-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-slate-50/60 py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
            Emergency Services
          </div>

          <h2
            id="emergency-heading"
            className="mt-6 wrap-break-words text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            Help is{" "}
            <span className="bg-linear-to-r from-rose-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              one tap away
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Call directly or get directions to the nearest facility —
            no searching for numbers in a moment that matters.
          </p>
        </div>

        {/* Emergency cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {emergencyServices.map((service) => (
            <EmergencyCard key={service.id} service={service} />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-400">
          Numbers shown are national helplines for India and may vary by
          state. Verify local emergency numbers for your area.
        </p>
      </div>
    </section>
  );
}

export default memo(Emergency);