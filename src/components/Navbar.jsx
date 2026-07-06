import { useCallback, useEffect, useRef, useState, memo } from "react";

/**
 * Primary in-page navigation. Section ids must match the `id` attribute
 * rendered by each corresponding section component.
 *
 * "smartcitizen-ai" is the id already defined on Hero.jsx — do not rename it.
 * The remaining ids assume the following sections will expose matching ids:
 *   Features.jsx      -> id="features"
 *   ReportIssue.jsx    -> id="report-issue"
 *   Stats.jsx (dashboard) -> id="dashboard"
 *   AIAssistant.jsx    -> id="ai-assistant"
 *   Emergency.jsx      -> id="emergency"
 *   Footer.jsx         -> id="contact"
 */
const NAV_LINKS = [
  { id: "smartcitizen-ai", label: "Home" },
  { id: "features", label: "Features" },
  { id: "report-issue", label: "Report Issue"},
  { id: "track-issue", label: "Track Issue" },
  { id: "ai-assistant", label: "AI Assistant" },
  { id: "emergency", label: "Emergency" },
  { id: "contact", label: "Contact" },
];

// Fallback used only if the header hasn't rendered yet when a scroll fires.
const FALLBACK_HEADER_OFFSET = 80;

function BrandMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="navbar-brand-linear" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill="url(#navbar-brand-linear)" />
      {/* Signal / pulse mark — civic monitoring, read as a live feed */}
      <path
        d="M7 18h4l2.2-6.5L17 24l2.8-9.5L21.4 18H27"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0].id);

  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const prefersReducedMotion = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Toggle the "scrolled" glass treatment once the page moves away from the top.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy: highlight whichever section is currently under the header.
  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight ?? FALLBACK_HEADER_OFFSET;
    const sections = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    );

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${headerHeight + 8}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on outside click or Escape, and lock body scroll while open.
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id);
    setIsMobileMenuOpen(false);

    if (!target) return;

    const headerHeight = headerRef.current?.offsetHeight ?? FALLBACK_HEADER_OFFSET;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  const handleNavClick = useCallback(
    (event, id) => {
      event.preventDefault();
      scrollToSection(id);
    },
    [scrollToSection]
  );

  return (
    <header
      ref={headerRef}
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
        isScrolled
          ? "border-b border-white/70 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/60 backdrop-blur-md",
      ].join(" ")}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <a
          href="#smartcitizen-ai"
          onClick={(event) => handleNavClick(event, "smartcitizen-ai")}
          className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          <BrandMark />
          <span className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Smart
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              Citizen
            </span>{" "}
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-sky-400 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ id, label }) => {
            const isActive = activeSection === id;
            const isEmphasized = id === "report-issue";

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(event) => handleNavClick(event, id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
                    isEmphasized
                      ? "bg-sky-600 text-white shadow-[0_10px_25px_rgba(2,132,199,0.25)] hover:-translate-y-0.5 hover:bg-sky-500"
                      : isActive
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-200 hover:bg-sky-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 lg:hidden"
        >
          <MenuIcon open={isMobileMenuOpen} />
        </button>
      </nav>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav-panel"
        ref={mobileMenuRef}
        className={[
          "grid overflow-hidden border-b border-white/70 bg-white/95 backdrop-blur-xl transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden",
          isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <ul className="min-h-0 overflow-hidden px-4 pb-4 pt-1 sm:px-6">
          {NAV_LINKS.map(({ id, label }) => {
            const isActive = activeSection === id;
            const isEmphasized = id === "report-issue";

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(event) => handleNavClick(event, id)}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  className={[
                    "block w-full rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
                    isEmphasized
                      ? "mt-2 bg-sky-600 text-center text-white shadow-[0_10px_25px_rgba(2,132,199,0.25)]"
                      : isActive
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default memo(Navbar);