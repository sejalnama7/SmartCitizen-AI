import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

/**
 * Category pool. Suggestion chip labels intentionally match these values
 * one-to-one so clicking a chip can auto-select the matching category.
 */
const CATEGORIES = [
  "Garbage Overflow",
  "Water Leakage",
  "Pothole",
  "Street Light",
  "Sewage Problem",
  "Fire Emergency",
  "Ambulance Required",
  "Road Accident",
  "Electricity Issue",
  "Stray Animals",
  "Other",
];

/** Keyword map used to surface relevant suggestion chips as the citizen types. */
const SUGGESTIONS = [
  { label: "Garbage Overflow", keywords: ["garbage", "trash", "waste", "overflow", "dump", "dumping", "bin"] },
  { label: "Water Leakage", keywords: ["water", "leak", "leakage", "pipe", "pipeline", "supply"] },
  { label: "Pothole", keywords: ["pothole", "road", "crack", "damaged", "hole"] },
  { label: "Street Light", keywords: ["street light", "streetlight", "light", "lamp", "dark", "bulb"] },
  { label: "Sewage Problem", keywords: ["sewage", "drain", "drainage", "gutter"] },
  { label: "Fire Emergency", keywords: ["fire", "flame", "burn", "smoke"] },
  { label: "Ambulance Required", keywords: ["ambulance", "medical", "injury", "health"] },
  { label: "Road Accident", keywords: ["accident", "crash", "collision"] },
  { label: "Electricity Issue", keywords: ["electricity", "power", "outage", "wire", "transformer", "current"] },
  { label: "Stray Animals", keywords: ["stray", "dog", "animal", "cattle", "cow", "bite"] },
];

const MOBILE_PATTERN = /^(\+91[-\s]?)?[6-9]\d{9}$/; // Indian mobile numbers — adjust for other regions.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INITIAL_FORM = {
  fullName: "",
  mobile: "",
  location: "",
  category: "",
  description: "",
};

/**
 * Ranks suggestion chips by keyword relevance to the current input. Falls
 * back to the full pool so the chip row is never empty once the citizen
 * starts typing.
 */
function getSuggestions(input) {
  const query = input.trim().toLowerCase();
  if (!query) return [];

  const scored = SUGGESTIONS.map((item) => ({
    label: item.label,
    score: item.keywords.filter((keyword) => query.includes(keyword) || keyword.includes(query)).length,
  })).filter((item) => item.score > 0);

  if (scored.length > 0) {
    return scored.sort((a, b) => b.score - a.score).slice(0, 6).map((item) => item.label);
  }

  const labelMatches = SUGGESTIONS.filter((item) => item.label.toLowerCase().includes(query));
  if (labelMatches.length > 0) return labelMatches.map((item) => item.label);

  return SUGGESTIONS.slice(0, 6).map((item) => item.label);
}

// Set VITE_API_URL in the frontend's .env for other environments,
// e.g. VITE_API_URL=https://api.smartcitizen.ai/api
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Submits the complaint to the real backend as multipart/form-data so the
 * image travels alongside the fields in one request, matching Multer's
 * single-file upload on the server (field name "image").
 */
async function submitComplaintReport(payload) {
  const response = await axios.post(`${API_BASE_URL}/report`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 20000,
  });
  return response.data; // { success, message, data: { trackingId, ... } }
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  );
}

function ReportIssue() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | success | error
  const [trackingId, setTrackingId] = useState(null);

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  const suggestions = useMemo(() => getSuggestions(formData.description), [formData.description]);

  // Release the object URL whenever the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleFieldChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const handleSuggestionClick = useCallback((label) => {
    setFormData((prev) => ({
      ...prev,
      description: label,
      category: CATEGORIES.includes(label) ? label : prev.category,
    }));
    setErrors((prev) => ({ ...prev, description: undefined, category: undefined }));
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Please upload a JPG, PNG, or WEBP image." }));
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: "Image must be smaller than 5MB." }));
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  }, []);

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: "Location isn't supported on this device." }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
        setErrors((prev) => ({ ...prev, location: undefined }));
        setIsLocating(false);
      },
      () => {
        setErrors((prev) => ({
          ...prev,
          location: "Couldn't access your location — please type it manually.",
        }));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const validate = useCallback(() => {
    const next = {};

    if (formData.fullName.trim().length < 2) {
      next.fullName = "Enter your full name.";
    }
    if (!MOBILE_PATTERN.test(formData.mobile.trim())) {
      next.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (formData.location.trim().length < 3) {
      next.location = "Enter a location or use your current location.";
    }
    if (!formData.category) {
      next.category = "Select a category.";
    }
    if (formData.description.trim().length < 10) {
      next.description = "Describe the issue in at least 10 characters.";
    }

    return next;
  }, [formData]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        const payload = new FormData();
        payload.append("fullName", formData.fullName.trim());
        payload.append("mobile", formData.mobile.trim());
        payload.append("location", formData.location.trim());
        payload.append("category", formData.category);
        payload.append("description", formData.description.trim());
        if (imageFile) payload.append("image", imageFile);

        const result = await submitComplaintReport(payload);

        setTrackingId(result.data.trackingId);
        setSubmitStatus("success");
        setFormData(INITIAL_FORM);
        removeImage();
      } catch (error) {
        const backendErrors = error.response?.status === 400 ? error.response.data?.errors : null;

        if (backendErrors) {
          setErrors(backendErrors);
          formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          setSubmitStatus("error");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, imageFile, removeImage, validate]
  );

  const resetForSecondReport = useCallback(() => {
    setSubmitStatus("idle");
    setTrackingId(null);
  }, []);

  return (
    <section
      id="report-issue"
      aria-labelledby="report-issue-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(56,189,248,0.06),transparent_35%)]" />
      </div>

      <div ref={formTopRef} className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            Report an Issue
          </div>

          <h2
            id="report-issue-heading"
            className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            Tell us what's wrong —{" "}
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              we'll take it from there
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Describe the issue in your own words, or fill in the details
            below — either way, it reaches the right department.
          </p>
        </div>

        {/* Success state */}
        {submitStatus === "success" ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-emerald-200/70 bg-emerald-50/70 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:mt-14 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 12.5l4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Report submitted</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Thanks — your tracking ID is{" "}
                <span className="font-semibold text-slate-900">{trackingId}</span>. You'll be
                notified as it's reviewed.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForSecondReport}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(2,132,199,0.25)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Report another issue
            </button>
          </div>
        ) : (
          <div className="mt-10 sm:mt-14">
            {/* Quick natural-language entry */}
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
              <label htmlFor="quick-description" className="text-sm font-semibold text-slate-700">
                Describe your issue
              </label>
              <div className="relative mt-2.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <path
                    d="M12 3.5l1.7 3.8 3.8 1.7-3.8 1.7L12 14.5l-1.7-3.8-3.8-1.7 3.8-1.7L12 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  id="quick-description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleFieldChange}
                  placeholder="e.g. Garbage overflowing near my house"
                  aria-describedby={errors.description ? "description-error" : undefined}
                  aria-invalid={Boolean(errors.description)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]"
                />
              </div>
              <FieldError id="description-error" message={errors.description} />

              {suggestions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSuggestionClick(label)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Full form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleFieldChange}
                    placeholder="Ananya Sharma"
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    aria-invalid={Boolean(errors.fullName)}
                    className={[
                      "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                      errors.fullName ? "border-rose-300" : "border-slate-200",
                    ].join(" ")}
                  />
                  <FieldError id="fullName-error" message={errors.fullName} />
                </div>

                {/* Mobile number */}
                <div>
                  <label htmlFor="mobile" className="text-sm font-semibold text-slate-700">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    value={formData.mobile}
                    onChange={handleFieldChange}
                    placeholder="98765 43210"
                    aria-describedby={errors.mobile ? "mobile-error" : undefined}
                    aria-invalid={Boolean(errors.mobile)}
                    className={[
                      "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                      errors.mobile ? "border-rose-300" : "border-slate-200",
                    ].join(" ")}
                  />
                  <FieldError id="mobile-error" message={errors.mobile} />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleFieldChange}
                      placeholder="Street, area, or landmark"
                      aria-describedby={errors.location ? "location-error" : undefined}
                      aria-invalid={Boolean(errors.location)}
                      className={[
                        "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                        errors.location ? "border-rose-300" : "border-slate-200",
                      ].join(" ")}
                    />
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      disabled={isLocating}
                      aria-label="Use current location"
                      className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3.5 text-slate-500 transition-colors duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      {isLocating ? (
                        <svg className="h-4.5 w-4.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M12 21s7-6.2 7-11.5A7 7 0 1 0 5 9.5C5 14.8 12 21 12 21Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <FieldError id="location-error" message={errors.location} />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFieldChange}
                    aria-describedby={errors.category ? "category-error" : undefined}
                    aria-invalid={Boolean(errors.category)}
                    className={[
                      "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                      errors.category ? "border-rose-300" : "border-slate-200",
                      formData.category ? "text-slate-800" : "text-slate-400",
                    ].join(" ")}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category} className="text-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                  <FieldError id="category-error" message={errors.category} />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                    Issue Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleFieldChange}
                    placeholder="Add any extra detail that will help the assigned team..."
                    aria-describedby={errors.description ? "description-error" : undefined}
                    aria-invalid={Boolean(errors.description)}
                    className={[
                      "mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-[15px]",
                      errors.description ? "border-rose-300" : "border-slate-200",
                    ].join(" ")}
                  />
                </div>

                {/* Image upload */}
                <div className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Upload Image (optional)</span>
                  <div className="mt-2">
                    {imagePreviewUrl ? (
                      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3">
                        <img
                          src={imagePreviewUrl}
                          alt="Selected issue"
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-700">{imageFile?.name}</p>
                          <p className="text-xs text-slate-400">
                            {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove image"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center transition-colors duration-200 hover:border-sky-300 hover:bg-sky-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-400">
                          <path
                            d="M12 16V4M12 4l-4 4M12 4l4 4"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-sm font-medium text-slate-600">
                          Tap to upload a photo
                        </span>
                        <span className="text-xs text-slate-400">JPG, PNG, or WEBP — up to 5MB</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </div>
                  <FieldError id="image-error" message={errors.image} />
                </div>
              </div>

              {submitStatus === "error" && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  Something went wrong submitting your report. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(2,132,199,0.26)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(ReportIssue);