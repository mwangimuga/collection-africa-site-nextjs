import type { Metadata } from "next";
import { site, offices } from "@/content/site";

export const baseUrl = site.url.replace(/\/$/, "");

export function absolute(path = "/") {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type SeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

/** Single source of truth for per-page metadata. Every page calls this. */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  noindex,
}: SeoInput): Metadata {
  const url = absolute(path);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      publishedTime,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ── Structured data ───────────────────────────────────────── */

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#organisation`,
    name: site.legalName,
    alternateName: site.name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    description: site.description,
    foundingDate: String(site.founded),
    email: site.email,
    telephone: site.phone,
    sameAs: [site.linkedin].filter(Boolean),
    areaServed: { "@type": "Country", name: "Kenya" },
    knowsLanguage: ["en", "sw"],
    address: offices
      .filter((o) => o.isHeadOffice)
      .map((o) => ({
        "@type": "PostalAddress",
        streetAddress: o.street,
        addressLocality: o.locality,
        addressCountry: "KE",
      })),
    location: offices.map((o) => ({
      "@type": "Place",
      name: `${site.name} — ${o.city}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.street,
        addressLocality: o.locality,
        addressCountry: "KE",
      },
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: site.name,
    publisher: { "@id": `${baseUrl}/#organisation` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceSchema(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    provider: { "@id": `${baseUrl}/#organisation` },
    areaServed: { "@type": "Country", name: "Kenya" },
    serviceType: input.name,
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.date,
    author: { "@type": "Organization", name: input.author },
    publisher: { "@id": `${baseUrl}/#organisation` },
    mainEntityOfPage: absolute(input.path),
    image: `${baseUrl}/api/og?title=${encodeURIComponent(input.title)}`,
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absolute(t.path),
    })),
  };
}

export function jobSchema(job: {
  title: string;
  summary: string;
  postedAt: string;
  closesAt?: string;
  location: string;
  type: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.postedAt,
    validThrough: job.closesAt,
    employmentType: job.type.toUpperCase().replace("-", "_"),
    hiringOrganization: { "@type": "Organization", name: site.legalName, sameAs: baseUrl },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "KE" },
    },
  };
}
