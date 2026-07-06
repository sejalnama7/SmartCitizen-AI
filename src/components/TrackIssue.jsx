import { memo, useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";

// Set VITE_API_URL in the frontend's .env for other environments,
// e.g. VITE_API_URL=https://api.smartcitizen.ai/api
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Uploaded images are served from the API's origin (e.g. /uploads/report-xxx.jpg),
// not the /api prefix, so strip it off when building absolute image URLs.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const STATUS_STYLES = {
  submitted: {
    label: "Submitted",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
  },
  "under review": {
    label: "Under Review",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  "in progress": {
    label: "In Progress",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  resolved: {
    label: "Resolved",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: {
  label: "Pending",
  badge: "border-amber-200 bg-amber-50 text-amber-700",
  dot: "bg-amber-500",
},

rejected: {
  label: "Rejected",
  badge: "border-rose-200 bg-rose-50 text-rose-700",
  dot: "bg-rose-500",
},
};

function normalizeStatusKey(status) {
  return (status || "").trim().toLowerCase().replace(/[_-]+/g, " ");
}

function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[normalizeStatusKey(status)] || {
      label: status || "Unknown",
      badge: "border-slate-200 bg-slate-50 text-slate-600",
      dot: "bg-slate-400",
    };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

/** Resolves a browser-loadable URL regardless of whether the backend returns
 *  image.url, imageUrl, or a plain string path. */
function resolveImageUrl(report) {
  const raw =
    report?.image?.url ||
    report?.imageUrl ||
    (typeof report?.image === "string" ? report.image : null);

  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${API_ORIGIN}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

function formatSubmittedDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Looks up a complaint by its Tracking ID against the existing backend.
 * Assumes a GET /api/report/track/:trackingId route (mirroring the
 * POST /api/report route already used in ReportIssue.jsx), returning
 * { success, message, data: {...} } on success and either a 404 or a
 * { success: false } payload when nothing matches. Update the path below
 * if reportRoutes.js exposes tracking under a different route.
 */
async function fetchReportByTrackingId(trackingId) {
  const response = await axios.get(
    `${API_BASE_URL}/report/${encodeURIComponent(trackingId)}`,
    { timeout: 15000 }
  );
  return response.data;
}

function TrackIssue() {
  const [trackingId, setTrackingId] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | not_found | error
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [imageBroken, setImageBroken] = useState(false);

  const inputRef = useRef(null);
  const imageUrl = useMemo(() => resolveImageUrl(report), [report]);

  const handleChange = useCallback(
    (event) => {
      setTrackingId(event.target.value);
      if (fieldError) setFieldError("");
    },
    [fieldError]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const trimmed = trackingId.trim();

      if (!trimmed) {
        setFieldError("Enter your Tracking ID to search for a report.");
        return;
      }

      setStatus("loading");
      setReport(null);
      setMessage("");
      setImageBroken(false);

      try {
        const result = await fetchReportByTrackingId(trimmed);

        if (result?.success && result?.data) {
          setReport(result.data);
          setStatus("success");
        } else {
          setStatus("not_found");
          setMessage(
            result?.message ||
              "We couldn't find a report with that Tracking ID. Double-check it and try again."
          );
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setStatus("not_found");
          setMessage(
            error.response?.data?.message ||
              "We couldn't find a report with that Tracking ID. Double-check it and try again."
          );
        } else if (error.response) {
          setStatus("error");
          setMessage(
            error.response.data?.message ||
              "Something went wrong while fetching your report. Please try again."
          );
        } else {
          setStatus("error");
          setMessage("We couldn't reach the server. Check your connection and try again.");
        }
      }
    },
    [trackingId]
  );

  const handleReset = useCallback(() => {
    setTrackingId("");
    setFieldError("");
    setStatus("idle");
    setReport(null);
    setMessage("");
    setImageBroken(false);
    inputRef.current?.focus();
  }, []);

  return (
    <section
      id="track-issue"
      aria-labelledby="track-issue-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.06),transparent_35%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            Track Your Complaint
          </div>

          <h2
            id="track-issue-heading"
            className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            Track Your{" "}
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              Issue
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Enter the Tracking ID you received when you submitted your report to check its
            latest status.
          </p>
        </div>

        {/* Search card */}
        <div className="mt-10 sm:mt-14">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8"
          >
            <label htmlFor="trackingId" className="text-sm font-semibold text-slate-700">
              Tracking ID
            </label>

            <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  id="trackingId"
                  name="trackingId"
                  type="text"
                  value={trackingId}
                  onChange={handleChange}
                  placeholder="Enter your Tracking ID"
                  aria-describedby={fieldError ? "trackingId-error" : undefined}
                  aria-invalid={Boolean(fieldError)}
                  className={[
                    "w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                    fieldError ? "border-rose-300" : "border-slate-200",
                  ].join(" ")}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(2,132,199,0.26)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Searching...
                  </>
                ) : (
                  "Track Issue"
                )}
              </button>
            </div>

            {fieldError && (
              <p id="trackingId-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                {fieldError}
              </p>
            )}
          </form>

          {/* Result region */}
          <div aria-live="polite" className="mt-6">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                <svg className="h-7 w-7 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-sm font-medium text-slate-600">Searching for your report...</p>
              </div>
            )}

            {status === "not_found" && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-amber-200/70 bg-amber-50/70 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.3)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
                    <path d="M19 19l-3.8-3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 10.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Tracking ID not found</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{message}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {message}
              </div>
            )}

            {status === "success" && report && (
              <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                {imageUrl && !imageBroken && (
                  <div className="h-56 w-full overflow-hidden bg-slate-100 sm:h-72">
                    <img
                      src={imageUrl}
                      alt="Photo submitted with the report"
                      onError={() => setImageBroken(true)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Tracking ID
                      </p>
                      <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                        {report.trackingId || trackingId}
                      </p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Category
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800 sm:text-[15px]">
                        {report.category || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Date Submitted
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800 sm:text-[15px]">
                        {formatSubmittedDate(report.createdAt || report.submittedAt || report.date)}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800 sm:text-[15px]">
                        {report.location || "—"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Description
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700 sm:text-[15px]">
                        {report.description || "—"}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-7 text-sm font-semibold text-sky-600 transition-colors duration-200 hover:text-sky-700"
                  >
                    Track another issue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(TrackIssue);