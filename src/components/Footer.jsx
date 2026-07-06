import { memo } from "react";

/**
 * Mirrors Navbar's section ids so these links scroll to the same places.
 * If Navbar's list changes, update this array to match.
 */
const quickLinks = [
  { id: "smartcitizen-ai", label: "Home" },
  { id: "features", label: "Features" },
  { id: "report-issue", label: "Report Issue" },
  { id: "dashboard", label: "Dashboard" },
  { id: "ai-assistant", label: "AI Assistant" },
];

/** Keep in sync with Emergency.jsx if numbers ever change. */
const emergencyLinks = [
  { label: "Ambulance", number: "102" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Disaster Management", number: "108" },
];

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <path d="M20 6.4a7 7 0 0 1-1.9.5 3.3 3.3 0 0 0 1.5-1.8 6.6 6.6 0 0 1-2.1.8 3.3 3.3 0 0 0-5.6 3 9.3 9.3 0 0 1-6.8-3.4 3.3 3.3 0 0 0 1 4.4 3.3 3.3 0 0 1-1.5-.4v.05a3.3 3.3 0 0 0 2.6 3.2 3.3 3.3 0 0 1-1.5.06 3.3 3.3 0 0 0 3.1 2.3A6.6 6.6 0 0 1 4 16.6a9.3 9.3 0 0 0 5 1.5c6 0 9.3-5 9.3-9.3v-.4A6.6 6.6 0 0 0 20 6.4Z" />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M14.5 8.5H16V6h-2c-1.7 0-3 1.3-3 3v1.5H9.5V13H11v6h2.5v-6h1.8l.3-2.5H13.5V9c0-.3.2-.5.5-.5Z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.3" cy="7.7" r="0.9" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10.5v5.5M8 8v.01M12 16v-3.2c0-1.3.9-2.3 2.1-2.3s1.9 1 1.9 2.3V16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

/**
 * Duplicates the offset-aware smooth scroll used in Navbar.jsx. If this
 * logic needs to change, consider extracting both into a shared
 * hooks/useScrollToSection.js.
 */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector("header");
  const headerHeight = header?.offsetHeight ?? 80;
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function FooterHeading({ children }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
      {children}
    </h3>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      aria-labelledby="footer-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-300"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#smartcitizen-ai"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("smartcitizen-ai");
              }}
              className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <svg width="30" height="30" viewBox="0 0 34 34" fill="none" aria-hidden="true" className="shrink-0">
                <defs>
                  <linearGradient id="footer-brand-linear" x1="0" y1="0" x2="34" y2="34">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <rect width="34" height="34" rx="10" fill="url(#footer-brand-linear)" />
                <path
                  d="M7 18h4l2.2-6.5L17 24l2.8-9.5L21.4 18H27"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight text-white">
                Smart
                <span className="bg-linear-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                  Citizen
                </span>{" "}
                <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </a>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              A civic intelligence platform helping citizens report issues
              and helping governments resolve them faster.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      {social.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency links */}
          <div>
            <FooterHeading>Emergency</FooterHeading>
            <ul className="mt-4 space-y-3">
              {emergencyLinks.map((emergency) => (
                <li key={emergency.label}>
                  <a
                    href={`tel:${emergency.number}`}
                    className="group flex items-center justify-between gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <span>{emergency.label}</span>
                    <span className="font-semibold text-slate-300 group-hover:text-rose-300">
                      {emergency.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="mailto:support@smartcitizen.ai"
                  className="transition-colors duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  support@smartcitizen.ai
                </a>
              </li>
              <li>
                <a
                  href="tel:+911140000000"
                  className="transition-colors duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  +91 11 4000 0000
                </a>
              </li>
              <li className="text-slate-500">
                Government Innovation Cell, New Delhi
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">
            © {currentYear} SmartCitizen AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built for a national civic-tech hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);