# Collection Africa — Design & Build Specification v2

**Status:** v3, revised 20 September 2026 after the original specification was supplied
**Relationship to the original spec:** the original *Redesign & Platform Specification* has now been received and reconciled item by item in **§11**. Where it and this document disagree, §11 states which won and why.

---

## 0. How to read this document

Sections 1–3 are decisions already implemented in the code. Section 9 is the list of things I removed from the previous build and why. Section 10 is what I still need from you. Anything marked **TODO(client)** also appears as a comment in the source at the exact place it is needed.

---

## 1. Positioning

| | |
|---|---|
| **Who this site is for** | Credit heads at banks, SACCOs and microfinance; county finance officers and revenue board members; CFOs and credit controllers at corporates, schools, insurers and landlords. Secondary: job applicants, and debtors trying to find a phone number. |
| **What it has to do** | Convince a procurement-minded professional that Collection Africa is the low-risk choice, then get them to request a briefing. |
| **What kills the sale** | Anything that reads as a cowboy debt collector. In a regulated market, perceived recklessness is a bigger risk to the buyer than a slightly higher fee. |
| **Tone** | Institutional, plain, specific. British English spelling. No exclamation marks, no growth-hack vocabulary, no superlatives we cannot evidence. |

The single most important editorial decision: **the site never claims a recovery rate, a fee, or a portfolio figure.** See §9.1.

---

## 2. Visual system

### 2.1 Concept — "the ledger"

Debt recovery is a business of statements, ageing schedules and reconciliation. The design borrows that vocabulary rather than the generic SaaS-dashboard one: hairline rules, a left description / right value column, tabular figures, and disciplined vertical rhythm. The page should read like a well-kept account.

The ledger is the **one** place the design spends boldness. Everything else — cards, buttons, forms — is deliberately quiet.

### 2.2 Palette

Brand navy, blue and gold are retained. Two corrections:

| Token | Hex | Use | Change from v1 |
|---|---|---|---|
| `--ink` | `#12162E` | Body text | New |
| `--navy` | `#1B2149` | Headings, dark bands, primary buttons | Deepened from `#232856` |
| `--blue-deep` | `#235391` | Links | Darkened for contrast |
| `--blue` | `#2F6DB4` | Focus rings, accents | Kept |
| `--gold` | `#A9761A` | **Text** accents, ledger values | Darkened from `#D4A029` — the original failed WCAG AA on white (2.6:1) |
| `--gold-bright` | `#D4A029` | Rules, decorative bars, dark backgrounds only | Original gold, demoted to non-text use |
| `--paper` | `#F4F6F9` | Alternate section background | New |
| `--rule` / `--rule-strong` | `#DDE2EC` / `#B9C2D4` | Hairlines | New |

The v1 stylesheet carried a comment claiming gold was `#00C235`. That is a green. Removed.

### 2.3 Typography

| Role | v1 | v2 | Why |
|---|---|---|---|
| Headings | Cambria | **Source Serif 4** | Cambria is a Microsoft desktop font. It cannot be licensed for web serving, so every non-Windows visitor was silently falling back to Times New Roman. Source Serif 4 is the closest open transitional serif and is designed for screen. |
| Body / UI | Montserrat | **Montserrat** | Kept for brand continuity. |

Scale: 1.25 minor third off a 17px base. Line length capped at 66ch body, 68ch prose. Tabular numerals on every figure.

### 2.4 Anti-pattern list (enforced)

These were present in v1 and are deliberately absent from v2:

- `01 / 02 / 03` numbered markers on non-sequential content. Numbering now appears **only** on the recovery process, which genuinely is a sequence.
- Tracked-out ALL-CAPS eyebrow labels above every heading. Replaced with sentence-case kickers that carry real information.
- Single-word italic accents in headlines (`We don't just *collect*. We connect.`).
- `→` appended to link and button text.
- Fade-and-slide-up entrance on every section. One orchestrated reveal, hero only, respecting `prefers-reduced-motion`.

### 2.5 Accessibility floor

WCAG 2.2 AA. Visible focus rings on every interactive element, skip link, semantic landmarks, `aria-current` on the active nav item, labelled form fields with inline errors, reduced-motion honoured, 44px minimum touch targets, no colour-only meaning.

---

## 3. Information architecture

```
/                               Home
/services                       Index
/services/debt-collection
/services/county-revenue-maximisation
/services/bulk-sms-communication
/services/credit-management-training
/services/skip-tracing-and-investigation
/about
/insights                       (was /blog — redirected)
/insights/[slug]
/careers
/contact
/search                         AI search, noindex
/ethics  /privacy  /terms
/admin                          CMS, staff login, noindex
/api/cms/*                      CMS API — kept off /api root so the
                                site's own form and AI routes are unaffected
```

The site lives in the `app/(frontend)` route group and the CMS in `app/(payload)`. They share an app but not a layout.

Service slugs were lengthened to carry their keyword. `301` redirects from every old URL are configured in `next.config.mjs` — **add to that list as Search Console reports 404s from the WordPress era.**

---

## 4. Technical architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, React 19 |
| Content management | **Payload CMS 3, embedded in the same Next.js app.** Admin at `/admin`, API at `/api/cms` |
| Database | Postgres (local, Neon, Supabase or Railway — any will do) |
| Rendering | Static by default; service and insight pages pre-rendered via `generateStaticParams`; API routes on the Node runtime |
| Styling | Hand-written CSS design system, no framework. No Tailwind — the site has ~15 distinct layouts and a token-driven stylesheet is smaller, faster and easier for a non-React developer to maintain |
| Content | Payload collections, with the typed modules in `/content` as seed data and runtime fallback |
| Forms | Node API routes → Nodemailer → your SMTP |
| AI | Anthropic SDK, server-side only |
| Media | Local disk by default; S3 or Cloudflare R2 by swapping one adapter |

### Why Payload, and why in the same app

The original spec proposed Strapi or Payload as a **separate service**, plus Supabase as a **second** database for forms, plus a third stack for the chatbot. That is three services, three bills and three sets of credentials for a site with fifteen pages.

Payload 3 runs *inside* the Next.js application. One repository, one deployment, one database. The admin panel is a route (`/admin`), not a separate server. Content is read through Payload's local API — a direct function call, not an HTTP round trip — so CMS-backed pages are as fast as static ones.

### The fallback design

Every page reads content through `lib/cms.ts` rather than importing from `/content` directly. That adapter returns CMS content when a database is configured and the typed modules when it is not.

Two things this buys:

- A developer can work on the front end with no database at all. `npm install && npm run dev` just works.
- If the database is unreachable in production, pages render the last known-good content instead of throwing a 500. A CMS outage becomes a stale-content problem, not an outage.

The `/content` modules are also the seed: `npm run cms:seed` pushes them into Payload on first run and skips anything already there, so it is safe to re-run.

### Collections

| Collection | Holds | Notes |
|---|---|---|
| Services | The five practices | Drafts + versions |
| Insights | Articles | Block-based body, drafts, scheduled by date |
| Vacancies | Open roles | `closesAt` drives job-listing expiry |
| Team | Leadership profiles | |
| Media | Images and CVs | Auto-generates thumb/card/hero sizes |
| Applications | The ATS pipeline | Received → Shortlisted → Interviewed → Offered → Rejected |
| Enquiries | Contact-form leads | New → Contacted → Qualified → Closed |
| Users | Staff logins | Admin and Editor roles |
| Company details (global) | Phones, emails, hours, offices | Changing the phone number here updates header, footer, contact page, schema and the AI assistant |

Applications and Enquiries are closed to public read and public create. They are written server-side by the form routes via the local API, so a visitor cannot enumerate them.

---

## 5. SEO specification

Implemented:

- Server-rendered HTML on every route (the v1 SPA shipped an empty `<div id="root">` to crawlers)
- Per-page `<title>`, meta description, canonical, Open Graph and Twitter card via one `buildMetadata()` helper
- Generated OG images at `/api/og?title=…` — no design work needed per page
- JSON-LD: `ProfessionalService`, `WebSite` + `SearchAction`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`, `JobPosting`
- `sitemap.xml` and `robots.txt` generated from the content modules — they cannot drift
- 301 redirect map for legacy URLs
- Security headers including HSTS
- AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) explicitly allowed — answer engines are a live referral channel and the FAQ schema feeds them directly

**Target keyword map**

| Page | Primary |
|---|---|
| `/` | debt collection Kenya |
| `/services/debt-collection` | debt recovery agency Nairobi |
| `/services/county-revenue-maximisation` | county own source revenue Kenya |
| `/services/bulk-sms-communication` | bulk SMS Kenya |
| `/services/credit-management-training` | credit management training Kenya |
| `/services/skip-tracing-and-investigation` | skip tracing Kenya |
| `/ethics` | ethical debt collection Kenya |

**Not yet done — needs you:** Google Business Profile for all three offices, Search Console verification, and a Kenyan-directory citation pass (see §10).

---

## 6. AI layer

Three surfaces, all server-side. No API key ever reaches the browser.

**6.1 Tawk.to** — human live chat plus Tawk's own AI assist. Loaded `lazyOnload` so it never competes with the page for main-thread time. Renders nothing until `NEXT_PUBLIC_TAWK_PROPERTY_ID` is set.

**6.2 On-site assistant** (`/api/chat`) — streams from Claude, grounded on the site's own content. Its operating rules are in `lib/ai.ts` and are deliberately restrictive:

- Answers only from site content
- Refuses all pricing, fee, commission and recovery-rate questions
- Refuses legal advice
- Stops the visitor if they begin entering third-party personal data
- Redirects debtors asking about their own account to the phone line

This is not caution for its own sake. A chatbot that improvises a commission rate or a legal position for a licensed collection firm creates real liability.

**6.3 AI search** (`/api/search`) — a lexical shortlist narrows the index, Claude writes a 2–4 sentence grounded answer with citations. **Keyword results render with or without an API key**; the AI summary is an enhancement that degrades silently.

The knowledge index (`lib/knowledge.ts`) is derived from the same typed content modules the pages render from, so publishing an article automatically teaches the assistant about it. Nothing to re-sync.

---

## 7. Forms

| Form | Route | Goes to |
|---|---|---|
| Contact / service enquiry | `/api/contact` | `MAIL_TO_ENQUIRIES` + auto-acknowledgement to sender |
| Job application with CV | `/api/careers` | `MAIL_TO_CAREERS` with the CV attached |

Both: Zod validation server-side, honeypot field, time-on-page check, per-IP rate limiting, inline field errors, `dataLayer` conversion events on success. Careers additionally enforces a 5 MB cap and PDF/Word-only.

Bot submissions get a `200` rather than an error, so scrapers can't learn what tripped them.

---

## 8. Performance budget

| Metric | Target |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 |
| INP | < 200ms |
| JS shipped on a content page | < 120 KB gzipped |
| Lighthouse SEO / Accessibility | 100 / ≥ 95 |

Third-party scripts (Tawk, GTM) are the only real risk. Both are deferred.

---

## 9. What I removed from v1, and why

**9.1 The fake live metrics — the most important change.**
The v1 home page displayed "Live portfolio pulse", `KSh 84.2M Nairobi portfolio`, `+24.8% recovery performance`, `Recovered this month KSh 18.6M`, and a `78.4/100 recovery probability index`, all hard-coded, all updating never, all labelled *live*.

For a licensed debt collector, publishing invented performance figures is not a design flourish. It is a misrepresentation risk with clients, a credibility problem the moment a prospect asks for the underlying data, and a gift to a competitor. **All of it is gone.** If you have audited figures you are willing to stand behind, tell me and I will design a place for them with a stated source and date.

**9.2 The duplicated home page.** `Home.tsx` in v1 contained its own header, footer, nav and contact form, ignoring the shared components entirely, with anchor links instead of routes. Two navigations, two footers, two contact forms, two sets of bugs. Now one of each.

**9.3 Dead forms.** Contact, careers and the quote form all called `preventDefault()` and showed a success message without sending anything. Any enquiry submitted to the v1 site was silently discarded.

**9.4 Manus build tooling.** `vite-plugin-manus-runtime`, `ManusDialog.tsx`, `public/__manus__/debug-collector.js` and `.manus-logs/` — third-party development instrumentation that should never reach production.

**9.5 The unused shadcn kit.** 50+ Radix component files were shipped for a site that uses roughly six of them. Removed; components are written directly.

**9.6 The dark mode toggle.** It was wired to a state variable on one page and did nothing anywhere else. A corporate site with one strong palette does not need it. Can be added properly if you want it — say so.

**9.7 The OAuth login scaffolding.** `getLoginUrl()`, `COOKIE_NAME`, session constants — for a login system that does not exist.

**9.8 The Google Maps embed.** It required a paid API key that was never set, so it rendered nothing. Replaced with plain address blocks and `Place` structured data, which is what actually helps local search.

---

## 10. Open items — I need your input

Ordered by how much they block launch.

**Blocking**

1. **The real `design_spec.md`**, if it exists.
2. **SMTP credentials** — host, port, username, password for a sending mailbox on your domain.
3. **Confirm the domain** is `www.collectionafrica.co.ke`.
4. **Postgres connection string** for staging and production (§4).
5. **Are the headline figures real?** See §9.1 and §11.2. Nothing goes on the site without a source.

**Needed before launch, not before build**

5. Tawk.to property ID and widget ID, and whether your plan includes AI Assist.
6. Anthropic API key (`console.anthropic.com`), and a monthly spend cap.
7. Leadership names, roles, one-line bios and 600×600 photos — `content/team.ts` currently holds placeholders that must not go live.
8. Client and partner logos, plus **written permission** to display each one (see §11.4).
9. Real vacancies — now entered in `/admin` rather than a file.
10. Logo files: SVG wordmark, `favicon.ico`, 180×180 `apple-touch-icon.png`, 512×512 `logo.png`.
11. Company registration number and any licence numbers you want published.
12. GTM or GA4 ID.
13. Confirm `ethics@collectionafrica.co.ke` exists and routes to compliance, not to the collections floor (§11.6).
14. **Advocate review of `/privacy` and `/terms`.** Both are drafts and are labelled as such on the page.

**Decisions for you**

15. **Kiswahili?** Your SMS advice says mixed-language outperforms English-only. The same may be true of the site. Next.js i18n routing is straightforward to add now and painful to retrofit.
16. **Should `/ethics` be more prominent?** It is currently the strongest differentiator on the site and it sits in the footer. I would put it in the main nav.
17. **Client testimonials or case studies?** Even anonymised ("a tier-2 bank, 14,000 accounts") would be the single biggest credibility addition available.


---

## 11. Reconciliation with the original specification

The original *Redesign & Platform Specification* arrived after the build. Below is every material item in it, and what happened to it.

### 11.1 Adopted as specified

| Item | Status |
|---|---|
| Headless CMS with blog authoring, SEO metadata fields, draft/publish workflow | **Built.** Payload, §4 |
| HR openings manager and applicant tracking pipeline with status tags | **Built.** Applications collection with the exact pipeline you described |
| Secure storage for candidate CVs | **Built.** Local disk by default, one-line swap to S3 or R2 |
| Careers link with an active job counter pill | **Built.** Counts live vacancies from the CMS |
| Services dropdown in the main nav | **Built**, as a plain dropdown rather than a mega menu |
| FAQ accordion | **Built.** Native `<details>`, so it works without JavaScript and is keyboard-accessible by default |
| Article view with related posts | **Built** |
| Contact form with subject routing | **Built.** Routes by service |
| Whistleblower / ethical compliance contact | **Built.** Separate `ethics@` address on the contact page, documented as bypassing the collections floor. This was the single best idea in your spec — for a collections firm it is a genuine differentiator and a regulatory asset |
| Terms, Privacy (Data Protection Act), Ethical Recovery Charter | **Built** |
| Nairobi / Kisumu / Nakuru addresses | **Adopted from your spec.** Mine had placeholders; yours had Mega City Mall Mezzanine and 7th Floor C.K. Patel Building. Now in the CMS |
| Chatbot with intent routing, lead capture and human handoff | **Built**, via Tawk.to + the on-site assistant |
| Next.js App Router, SSR/SSG, Vercel + Cloudflare | **Built** |
| Privacy-friendly analytics option | **Supported.** GTM is wired; Plausible or PostHog drop in as a one-line replacement if you prefer no Google |

### 11.2 Adopted with material changes

**The stats counter block — `25+ Years`, `KES 10B+ Recovered Capital`, `99.8% Ethical Compliance Rate`.**
Not published as specified. "25+ years" is fine and provable from your 2001 incorporation. The other two are not. *KES 10B+ recovered* is a claim a prospect's procurement team will ask you to evidence, and a competitor will ask you to evidence publicly. *99.8% ethical compliance rate* has no defined denominator — 99.8% of what, measured by whom? A number that cannot survive the question "how is that calculated?" costs more credibility than it buys. Send me audited figures with a source and a date and I will build the block properly, with the source shown.

**The `🟢 ISO-Compliant & Ethical Debt Recovery` badge.**
Removed until you send a certificate number and issuing body. Claiming ISO certification without holding it is a misrepresentation, and it is trivially checkable. If you hold it, the certificate number belongs on the page — that is worth far more than a badge.

**The "Debt Recovery Estimate Calculator".**
Not built, and I'd advise against it. A tool that takes debt age and volume and returns a recovery probability is a performance representation made by your website to a prospect, without a human reviewing the portfolio. If the real outcome undershoots it, you have handed the client a printed expectation you set. It also publishes the shape of your pricing model to competitors. What I would build instead: a structured portfolio-profile form — age bands, sector, volume, what has been tried — that returns nothing but routes a well-qualified lead to your team. Same conversion mechanic, none of the liability. Say the word.

**Named client logos — Equity, KCB, Absa, NCBA, HELB, counties, D.light.**
Not built. Two problems: many bank and county contracts contain confidentiality clauses that forbid naming the relationship, and publishing a logo without written permission is a trademark exposure. Send me written permission per logo and the grid goes in the same day. In the meantime, anonymised case studies ("a tier-1 bank, 14,000 accounts, 11 months") carry most of the credibility with none of the risk.

### 11.3 Not adopted — architecture

**Supabase/PostgreSQL as a second database, separate from the CMS.**
Payload already owns a Postgres database. Adding Supabase for form submissions means two databases, two schemas, two backup regimes and two places a candidate's personal data lives. Applications and enquiries are now Payload collections in the same database.

**LangChain + Pinecone vector search for the chatbot.**
The site has roughly twenty pages. A vector database is the right tool at ten thousand documents; at twenty it is a monthly bill and an embedding pipeline to keep in sync. The assistant uses a lexical shortlist over the live content index — the shortlist rebuilds itself from the CMS on every request, so publishing an article teaches the assistant about it immediately, with nothing to re-index. If the content ever reaches a few hundred pages, swapping in embeddings is a change to one function.

**Strapi/Sanity as a separately hosted CMS.**
Same reasoning as §4: an embedded Payload is one deployment instead of two, and content reads become function calls instead of network requests.

### 11.4 Not adopted — visual language

Your spec asks for the Infoma aesthetic: glassmorphism badges, status pills with glowing dots, gradient text overlays, backdrop blur, hover lifts on every card.

I've deliberately not built that, and I want to be straightforward about why rather than quietly ignoring it.

That visual language reads, in 2026, as *recently launched software startup*. It is the default output of every site builder and every AI design tool, which means your prospect has seen it forty times this month on products that did not exist last year. Collection Africa's actual competitive asset is the opposite of novelty: twenty-five years, three offices, a compliance record, and the fact that a bank's credit committee can put your name in a board paper without anyone raising an eyebrow. The design should be *doing* that work.

So the site borrows the vocabulary of the business instead — statements, ledgers, ruled columns, tabular figures (§2.1). It is quieter, and it is much harder to mistake for a fintech that launched in March.

This is your call, not mine. If you want the Infoma direction, I will build it properly — but I would want that decision made on the argument above rather than by default.

Two specific sub-items:

- **Gradient text on headlines** — I would push back on this one regardless of direction. It fails contrast checks, renders unpredictably across browsers, and is the single most recognisable AI-design tell currently in circulation.
- **Recovery Emerald `#059669` as the CTA colour** — this one I think you're right about, and I did not go far enough. Green for *positive action* is a sound instinct in a business about restoring balance. Currently navy carries the primary CTA and emerald appears only in success states. Worth ten minutes of discussion.

### 11.5 Typography — open disagreement

Your spec: Plus Jakarta Sans or Inter, sans throughout.
Built: Source Serif 4 headings, Montserrat body.

Inter and Plus Jakarta Sans are excellent and completely neutral, which is the problem — they are the house faces of the software industry and carry its associations. A transitional serif reads institutional, which is what you are selling. It is also closest to the Cambria your brand already specified.

Montserrat is retained from your existing brand.

If you want sans throughout, it is a two-line change in `app/(frontend)/fonts.ts`. I'd like to talk you out of it first.

### 11.6 Dark mode — a decision I need from you

Your spec wants a dark/light toggle with local-storage persistence. The previous build had one that did nothing on twelve of thirteen pages.

Arguments for: your spec asks for it, and some users genuinely prefer it.
Arguments against: it doubles the visual QA surface on every future change, and the audience for this site is a credit officer on a work laptop during office hours, not a developer at midnight. Almost no bank, insurer or county website offers one.

My recommendation is to skip it and spend the time on case studies instead. But the design system is fully token-driven, so adding it later is a `@media (prefers-color-scheme: dark)` block and a toggle — it is not a rebuild. **Tell me which way you want it.**

### 11.7 Items in your spec still outstanding

- **Partners grid with filter tabs (Banks / Parastatals / Counties)** — blocked on §11.4 permissions. The component is trivial once the logos and permissions arrive.
- **Table of contents on articles** — not built. Worth doing for the longer pieces; say the word.
- **Tabbed branch cards with embedded Google Maps on contact** — branch details are built as ledger rows rather than tabs. Maps embeds require a billed API key and hurt page speed; `Place` structured data does more for local search. Revisit if you want the visual.
- **Blog category filter** — the index lists everything and site search covers it. A filter is worth adding once you pass roughly fifteen articles.
