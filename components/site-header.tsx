"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/logo";
// Contact details here are the static fallback; the footer and contact page
// read live values from the CMS. Kept static so the header stays a client
// component and renders instantly.

export function SiteHeader({ openRoles = 0 }: { openRoles?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="masthead">
      <div className="masthead__strip">
        <div className="shell">
          <span>
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            {" · "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </span>
          <span>{site.hours}</span>
        </div>
      </div>

      <div className="shell masthead__bar">
        <Logo tone="dark" />

        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
            >
              {item.label}
              {item.href === "/careers" && openRoles > 0 && (
                <span className="count-pill">{openRoles}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="masthead__actions">
          <Link href="/search" className="icon-btn" aria-label="Search the site">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer" id="mobile-drawer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link href="/search">Search</Link>
          <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
        </div>
      )}
    </header>
  );
}
