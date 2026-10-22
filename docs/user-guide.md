# Collection Africa website — operator's guide

Everything you need to connect, run and edit the site. Written for whoever maintains it, not just for a developer.

**Contents**

1. [Running it locally](#1-running-it-locally) · [Making it faster](#11-making-local-development-faster)
2. [Connecting the forms (SMTP)](#2-connecting-the-forms-smtp) · [Microsoft 365 setup and its 2026 deadline](#23a-setting-up-microsoft-365-specifically)
3. [Connecting Tawk.to live chat and AI](#3-connecting-tawkto-live-chat-and-ai)
4. [Connecting the Claude assistant and AI search](#4-connecting-the-claude-assistant-and-ai-search)
5. [Connecting Google Analytics and Search Console](#5-connecting-google-analytics-and-search-console)
6. [Editing content in the CMS](#6-editing-content-in-the-cms) · [Brand assets — logos and banners](#69-brand-assets--logos-and-banners)
7. [Deploying — Vercel, a VPS, or cPanel](#7-deploying)
8. [Post-launch SEO checklist](#8-post-launch-seo-checklist)
9. [Troubleshooting](#9-troubleshooting)
10. [Costs](#10-costs)

---

## 1. Running it locally

You need **Node.js 20.9 or newer**. Check with `node -v`.

**A note on versions.** `package.json` pins Next.js and every `@payloadcms/*` package to exact, tested versions rather than `^` ranges. Payload's packages peer-depend on each other and on a specific Next.js range, and that range changes between Payload releases — installing with loose ranges is the most common cause of an `ERESOLVE` error on this stack. If you ever bump one, bump Next and all the `@payloadcms/*` packages together, to versions documented as compatible on payloadcms.com/docs, then run `npm install` and `npm run cms:types` (§6) in the same sitting.

```bash
cd cal-web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

The site runs with an empty `.env.local`, and **with no database**. Content comes from the typed files in `/content`, forms will error, the assistant won't appear and Tawk won't load. Everything else works. Fill in the sections below as credentials arrive.

---

## 1.1 Making local development faster

If pages take many seconds to appear, that is almost always development mode rather than the site. Here is what's actually happening and what to do about it.

### Why dev mode feels slow

**Next.js compiles each route the first time you visit it.** In development there is no pre-built bundle — the first hit on `/services/debt-collection` compiles that page, its layout and every component it imports, then serves it. Five to fifteen seconds on a first visit is normal. The second visit is near-instant. Editing a file recompiles only what changed.

**This is not what your visitors will experience.** To see the real thing:

```bash
npm run build
npm run start
```

That is the production build. Pages should appear in well under a second. If they do, there is no performance problem — you were measuring the compiler.

### Fixes, in order of how much they help

**1. Use Turbopack — already on.** `npm run dev` now runs `next dev --turbopack`, which is substantially faster at cold compiles than webpack. If you hit a bug you suspect is Turbopack's, `npm run dev:webpack` falls back.

**2. Delete a stale cache.** A `.next` folder left over from a previous structure will cause slow, strange behaviour:

```bash
rm -rf .next
npm run dev
```

Do this after pulling changes that moved files around — the CMS restructure moved every page into `app/(frontend)`, so do it now.

**3. The first start downloads fonts.** `next/font/google` fetches Source Serif 4 and Montserrat from Google once, at build time, then self-hosts them. On a slow or throttled connection that single fetch can add a long pause to a cold start, and if it times out Next retries. It is cached in `.next` afterwards.

To remove the dependency entirely — worth doing if your connection is unreliable or your build server has no outbound internet:

- Download both families from `fonts.google.com` and put the `.woff2` files in `public/fonts/`
- Replace `app/(frontend)/fonts.ts` with `next/font/local` declarations pointing at them

The rest of the site needs no changes; it reads the `--font-serif` and `--font-sans` variables either way.

**4. If you are on Windows, check where the project lives.** Running a Node project from a Windows drive through WSL (`/mnt/c/...`) makes every file read cross the filesystem boundary and is dramatically slower. Move the project inside the Linux filesystem (`~/projects/cal-web`) and it will transform. Likewise, if you are on Windows natively, add the project folder and your Node install to your antivirus exclusions — real-time scanning of thousands of small `node_modules` reads is a common cause of this exact complaint.

**5. Don't run it over a network drive or a synced folder.** Dropbox, OneDrive and Google Drive all try to sync `node_modules` and `.next`. That will make everything crawl and can corrupt builds.

### What to check if production is slow

Run Lighthouse or PageSpeed Insights on the deployed site, not on localhost. The two things most likely to show up:

- **Tawk.to and Google Tag Manager.** Both are third-party scripts, both are already deferred, and both still cost something. If Lighthouse flags them, that is the trade for having live chat.
- **The database.** If the CMS is on a Postgres instance far from your server — a US-hosted free tier serving a Kenyan site — every page render pays that round trip. Host the database in the same region as the app.

---

## 2. Connecting the forms (SMTP)

The contact form and the job-application form both post to a Node API route, which emails you via your own mail server. Nothing is stored on the website, and no third-party form service sees your enquiries.

### 2.1 What you need

A mailbox on your domain that is allowed to send. Ask whoever hosts your email (cPanel, Google Workspace, Microsoft 365, Zoho) for:

- SMTP host
- SMTP port
- Username and password
- Whether the port uses SSL

Create a dedicated mailbox — `website@collectionafrica.co.ke` — rather than using a person's account. If the password leaks, you disable one mailbox instead of someone's inbox.

### 2.2 Common provider settings

| Provider | Host | Port | Secure | Notes |
|---|---|---|---|---|
| cPanel / shared hosting | `mail.yourdomain.co.ke` | 465 | `true` | Most Kenyan hosts |
| cPanel (STARTTLS) | `mail.yourdomain.co.ke` | 587 | `false` | |
| Google Workspace | `smtp.gmail.com` | 587 | `false` | Needs a 16-character **App Password**, not the account password. Requires 2-step verification enabled first. |
| Microsoft 365 | `smtp.office365.com` | 587 | `false` | See §2.3a below — this one has a real deadline attached |
| Zoho Mail | `smtp.zoho.com` | 465 | `true` | |

### 2.3a Setting up Microsoft 365 specifically

This one needs more care than the others, for two reasons: it's very likely **switched off by default** for your mailbox even though nothing else about your account suggests that, and Microsoft has published a **firm date** after which the simple username/password method below stops working tenant-wide unless someone re-enables it.

**Step 1 — turn SMTP AUTH on for the sending mailbox.**
Most Microsoft 365 mailboxes have SMTP AUTH switched off by default, independent of anything else — this is very often why the form silently fails on a fresh account with correct-looking credentials. An admin needs to:

1. Go to **admin.microsoft.com** → **Users → Active users** → select the mailbox you're sending from (e.g. `website@collectionafrica.co.ke`).
2. Open the **Mail** tab → **Manage email apps**.
3. Tick **Authenticated SMTP** → Save.

(Or, for the whole tenant at once: **Exchange admin center → Mail flow → Auth policies**, if you'd rather not do it per mailbox.)

**Step 2 — check whether MFA blocks it.**
If that mailbox has modern, Conditional-Access-based MFA enforced (the normal setup on most tenants today), a plain password will be rejected regardless of step 1 — SMTP AUTH doesn't support an MFA challenge. Either exclude that one service mailbox from MFA (reasonable for a mailbox that only sends automated mail and that nobody signs into interactively), or use **legacy per-user MFA with an app password** if your tenant still supports it. If neither is available to you, you need the OAuth2 route in the callout below instead.

**Step 3 — fill in `.env.local`** as in the table below, then test as in §2.4.

> ⚠️ **This method has a published expiry date.** Microsoft is retiring plain username/password ("Basic Auth") for SMTP AUTH: it keeps working as configured above through **December 2026**, then gets **switched off by default for every existing tenant at the end of December 2026** (an admin can still turn it back on for a while after that), and is **not available at all for any Microsoft 365 tenant created after December 2026**. This is a real, dated Microsoft policy, not a hypothetical.
>
> What this means for you: what's below will work today and for the near future, but isn't a "set it up once and forget it" solution the way it is with the other providers in the table. The durable fix is to authenticate via **OAuth2 (Microsoft Entra app registration + Graph API "Mail.Send", or OAuth2-authenticated SMTP)** instead of a plain password — Microsoft's own recommended replacement, and not being deprecated. That's a genuine piece of setup work in your Microsoft tenant (an app registration, an admin-consented permission, a client secret), not just an environment variable, so I haven't built it in unasked. **Tell me when you want it and I'll wire the code for it** — worth doing well before December 2026 rather than after your contact form quietly stops sending.

### 2.3 Fill in `.env.local`

```bash
SMTP_HOST=mail.collectionafrica.co.ke
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=website@collectionafrica.co.ke
SMTP_PASS=the-mailbox-password
MAIL_FROM="Collection Africa Website <website@collectionafrica.co.ke>"
MAIL_TO_ENQUIRIES=marketing@collectionafrica.co.ke
MAIL_TO_CAREERS=hr@collectionafrica.co.ke
```

`MAIL_FROM` **must** be a real mailbox on your own domain. Setting it to the visitor's address (a common shortcut) will get your mail rejected for SPF failure. The visitor's address is set as `Reply-To` instead, so hitting reply in your inbox still replies to them.

### 2.4 Test it

Restart the dev server, go to `/contact`, and submit. You should get:

- a notification at `MAIL_TO_ENQUIRIES`
- an acknowledgement at the address you typed in the form

If nothing arrives, check the terminal — the route logs the SMTP error — then see §9.

### 2.5 Deliverability

Before launch, ask your DNS administrator to confirm three records exist for `collectionafrica.co.ke`:

- **SPF** — one `TXT` record, e.g. `v=spf1 include:_spf.google.com ~all`. Never publish two SPF records; that breaks both.
- **DKIM** — supplied by your mail provider.
- **DMARC** — a `TXT` record at `_dmarc.collectionafrica.co.ke`. Start with `v=DMARC1; p=none; rua=mailto:dmarc@collectionafrica.co.ke` and tighten to `p=quarantine` once reports look clean.

Without these, acknowledgement emails land in spam and your enquirers assume you ignored them.

### 2.6 Changing where mail goes

Edit `MAIL_TO_ENQUIRIES` / `MAIL_TO_CAREERS` and redeploy. Several recipients: separate with commas — `a@x.co.ke,b@x.co.ke`.

### 2.7 Adding a field to the contact form

Three files, in order:

1. `lib/validation.ts` — add the field to `enquirySchema`
2. `components/contact-form.tsx` — add the `<label className="field">` block
3. `app/api/contact/route.ts` — add it to the `rows` array so it appears in the email

The `name` attribute must match in all three.

---

## 3. Connecting Tawk.to live chat and AI

### 3.1 Get your IDs

1. Sign up at **tawk.to** and create a property for `collectionafrica.co.ke`.
2. Go to **Administration → Channels → Chat Widget**.
3. Look at the widget code Tawk shows you. It contains a URL like:

   ```
   https://embed.tawk.to/65f1a2b3c4d5e6f7a8b9c0d1/1hq9k8j7i
                          └──── property ID ────┘ └ widget ID ┘
   ```

4. Copy both into `.env.local`:

   ```bash
   NEXT_PUBLIC_TAWK_PROPERTY_ID=65f1a2b3c4d5e6f7a8b9c0d1
   NEXT_PUBLIC_TAWK_WIDGET_ID=1hq9k8j7i
   ```

Don't paste Tawk's `<script>` block anywhere — `components/tawk-widget.tsx` handles loading it properly. Pasting it directly would load it eagerly and cost you page-speed score.

5. Restart the dev server. The bubble appears bottom-right, offset above our own assistant button.

### 3.2 Turn on Tawk's AI

Tawk's AI assist is a paid add-on and appears under **Administration → AI Assist** (sometimes branded **Apollo**). Once enabled:

1. **Feed it your content.** Add `https://www.collectionafrica.co.ke` as a knowledge source and let it crawl. Re-crawl after you publish new pages.
2. **Add the guardrails.** Paste this into the AI persona / instructions box — it mirrors the rules our own assistant follows:

   > You are the chat assistant for Collection Africa Kenya Limited, a licensed debt recovery firm in Kenya. Answer only from the Collection Africa website. Never quote or estimate a fee, commission, recovery rate or success rate — direct those to a briefing. Never give legal advice. Never ask for or accept a debtor's name, ID number or account balance in chat; direct that to the contact form or +254 116 028 888. If a visitor is a debtor asking about their own account, ask them to call. Keep answers to two or three sentences, in plain British English.

3. **Set the handoff.** Configure AI to escalate to a human agent when it cannot answer, and set your office hours so out-of-hours visitors get the offline form rather than a dead widget.

### 3.3 Departments and routing

Under **Administration → Departments**, create at least *Enquiries* and *Debtor support*. Debtor conversations need different handling from sales conversations, and mixing them in one queue causes exactly the compliance problems the charter exists to prevent.

### 3.4 Privacy obligation

Tawk stores chat transcripts on its own infrastructure, outside Kenya. This is already disclosed in `/privacy` under third-party processors. If you switch providers, update that page — it's a Data Protection Act requirement, not housekeeping.

### 3.5 Turning it off

Delete the two `NEXT_PUBLIC_TAWK_*` values and redeploy. The component renders nothing without them.

---

## 4. Connecting the Claude assistant and AI search

This is the assistant that answers from your own content, separate from Tawk.

### 4.1 Get a key

1. Go to **console.anthropic.com**, sign up as an organisation.
2. **Billing** → add a payment method → **set a monthly spend limit**. Do this before generating the key.
3. **API Keys** → *Create key* → name it `collectionafrica-website`.
4. Copy it immediately; it is shown once.

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

The key is read server-side only. It is never sent to the browser. **Never** prefix it with `NEXT_PUBLIC_` — that would publish it to every visitor.

### 4.2 What each feature does

| Feature | Route | Behaviour without a key |
|---|---|---|
| Floating assistant | `/api/chat` | Hide it: set `NEXT_PUBLIC_ENABLE_ASSISTANT=false` |
| AI search | `/api/search` | Keyword search still works; the AI summary is skipped |

### 4.3 Changing what the assistant says

Open `lib/ai.ts`. `assistantSystemPrompt()` holds the rules. Edit the bulleted list in plain English and redeploy.

Before you loosen anything, understand what each rule prevents:

- **No pricing** — an invented commission rate is a misrepresentation you may be held to.
- **No legal advice** — you are not a law firm, and an incorrect statement about limitation periods or enforcement could be relied on.
- **No third-party personal data** — a visitor pasting a debtor's ID number into a chat box creates a Data Protection Act exposure the moment it's transmitted.
- **Debtors go to the phone** — you cannot verify identity in an anonymous chat window.

### 4.4 The knowledge base

There isn't one to maintain. `lib/knowledge.ts` rebuilds the index from `/content` on every request, so a new service or article is available to the assistant the moment it deploys. If you add a whole new content *type*, add it to `buildIndex()` in the same file.

### 4.5 Changing the opening message or suggested questions

`components/assistant.tsx`, the `OPENER` and `SEEDS` constants at the top.

### 4.6 Controlling cost

Built in already: a 5-page context shortlist rather than the whole site, an 8-message conversation window, a 700-token response cap, and per-IP rate limiting (25 messages per 15 minutes, in `app/api/chat/route.ts`).

Realistically this costs a few dollars a month at normal traffic. The spend cap in §4.1 is your backstop — set it.

### 4.7 Reviewing what people ask

Conversations aren't stored anywhere. That is deliberate — no transcripts means no data to breach. If you want them, that is a new feature and needs a privacy-policy update and a retention period before it is built. Ask and I'll scope it.

---

## 5. Connecting Google Analytics and Search Console

### 5.1 Google Tag Manager

1. Create a container at **tagmanager.google.com** for `collectionafrica.co.ke`.
2. Copy the ID (`GTM-XXXXXXX`) into `NEXT_PUBLIC_GTM_ID`.
3. Add your GA4 tag, and any Ads tags, **inside GTM** rather than adding more scripts to the site.

### 5.2 Conversion tracking — already wired

The site pushes two events to `dataLayer` on success:

| Event | Fires when | Payload |
|---|---|---|
| `enquiry_submitted` | Contact form succeeds | `service` |
| `application_submitted` | Job application succeeds | `role` |

In GTM: **Triggers → New → Custom Event**, event name `enquiry_submitted`, then attach a GA4 event tag. That's your conversion. Nothing to add to the code.

### 5.3 Search Console

1. Add the property at **search.google.com/search-console**. Use the *Domain* property type — it covers www and non-www together.
2. Verify via DNS `TXT` (best), or paste the HTML-tag token into `GOOGLE_SITE_VERIFICATION` and redeploy.
3. Submit `https://www.collectionafrica.co.ke/sitemap.xml`.
4. After a fortnight, open **Pages → Not indexed** and check for 404s from the old WordPress URLs. Add each one to the `redirects()` array in `next.config.mjs`.

### 5.4 Google Business Profile

Do this for **all three offices**. For a Nairobi search like "debt collection agency near me", the Business Profile outranks anything on the website. Same name, address and phone as the site, exactly — inconsistency is what suppresses local rankings.

---

## 6. Editing content in the CMS

The site has a built-in admin panel at **/admin**. No separate service, no second login system, no extra hosting bill — it runs inside the same application.

### 6.1 Setting up the database, once

You need a Postgres database. Any of these work:

| Option | Good for |
|---|---|
| Local Postgres or Docker | Development |
| **Neon** | Production — generous free tier, serverless |
| **Supabase** | Production — free tier, also gives you a SQL browser |
| Railway / Render | Production — simple, cheap |

Whichever you pick, host it **in the region closest to your server**. A database in Virginia serving a site in Nairobi adds a round trip to every page.

Add two values to `.env.local`:

```bash
DATABASE_URI=postgres://user:password@host:5432/collectionafrica
PAYLOAD_SECRET=<paste the output of: openssl rand -base64 32>
```

`PAYLOAD_SECRET` signs the login sessions. Use a different one in production from development, and never commit either.

Then:

```bash
npm run cms:seed
```

That creates the tables, pushes everything currently in `/content` into the CMS, and prints what it did. It skips anything that already exists, so it is safe to run again.

Open **http://localhost:3000/admin** and create the first account. (Or set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env.local` before seeding and it creates one for you.)

### 6.2 What's in the admin panel

**Content**

- **Services** — the five practices. Drafts supported: save without publishing and nothing appears on the site until you hit publish.
- **Insights** — articles, built from blocks (paragraph, heading, sub-heading, bullet list, pull quote). No HTML to write.
- **Team** — leadership profiles and photos.
- **Media** — every image. Upload once; the system generates thumbnail, card and hero sizes automatically.

**Recruitment**

- **Vacancies** — open roles. Setting *Closes at* makes Google expire the job listing correctly.
- **Applications** — every CV submitted, with a pipeline: Received → Shortlisted → Interviewed → Offered → Rejected. Download the CV, add internal notes, move the status.
- **Enquiries** — every contact-form submission, with New → Contacted → Qualified → Closed.

**Settings**

- **Company details** — phone, email, hours, LinkedIn and all three office addresses. Change the phone number here and it updates the header, footer, contact page, structured data and the AI assistant's knowledge in one edit.
- **Users** — staff accounts. *Editor* can publish content and work the pipelines. *Admin* can also manage users.

### 6.3 Publishing an insight

**Insights → Create new.**

- **Title** — what it says.
- **Slug** — the URL. `debt-collection-laws-kenya` becomes `/insights/debt-collection-laws-kenya`. Lower case, hyphens, no spaces. Changing it later breaks existing links, so get it right first time.
- **Description** — this is the snippet Google shows in results. Aim for 140–158 characters and write it as a sentence a person would read, not a keyword list.
- **Category, date, author, reading time** — reading time is roughly words ÷ 220.
- **Body** — add blocks in order. Use *Heading* for section breaks, *Pull quote* sparingly (one per article at most).
- **Keywords** — two to five phrases someone would actually type into Google.

Save as draft while you work. Hit publish when it is ready.

The moment it publishes, the article appears on `/insights`, on the home page if it is among the three newest, in `sitemap.xml`, in site search, and in the AI assistant's knowledge. Nothing to re-index.

### 6.4 Adding a service

**Services → Create new.** Fill in every field.

Two that matter:

- **Process stages** render as numbered steps, so only use them for a genuine sequence. Unordered capabilities go in *Capabilities*.
- **FAQs** become FAQ structured data — these are what Google shows directly in search results, and what the AI assistant quotes. **Never state a fee, commission or recovery rate in an FAQ.**

Set *Order* to control where it appears (lower first). The new service shows up in the nav, footer, home ledger, services index and sitemap automatically.

### 6.5 Working the recruitment pipeline

When someone applies, two things happen: the CV is emailed to your careers inbox, and the application is saved to **Applications**.

The email is the alert. The panel is the record. Work from the panel — change the status as the candidate progresses, and keep your notes there rather than in a WhatsApp thread.

**A data protection note that matters.** Each application has a *Retain until* date, defaulting to six months out. That is the retention period stated in your published privacy policy, so it is a commitment, not a suggestion. Delete applications on or past that date unless the candidate agreed to a longer hold. Also: a candidate can request a copy of everything you hold about them, **including your internal notes**. Write them accordingly.

### 6.6 Falling back to files

If `DATABASE_URI` is blank, the site reads from `/content` instead and everything still works. That is deliberate — it means a developer can work without a database, and a database outage degrades to stale content rather than a 500 page.

It also means the files in `/content` are your seed data. Once you are live and editing in the panel, the CMS is the source of truth and those files are only a safety net.

### 6.7 Images

Upload through **Media**, or directly in the field that needs one. Give every image **alt text** — the field is required because screen readers and search engines both need it.

Export photos at twice their display size. Team photos should be 600×600.

Files you still need to drop into `/public` by hand:

- `favicon.ico`
- `apple-touch-icon.png` — 180×180
- `logo.png` — 512×512, used in structured data

Social preview images are generated automatically at `/api/og`.

### 6.8 Moving uploads to cloud storage

By default uploads go to `public/uploads` on the server. That is fine on a VPS. It does **not** work on Vercel, where the filesystem is ephemeral — uploads would vanish on the next deploy.

If you deploy to Vercel, install the S3 or R2 adapter and point it at a bucket:

```bash
npm install @payloadcms/storage-s3
```

Then add the plugin to `payload.config.ts`. Cloudflare R2 is the cheaper option and has no egress fees.

## 6.9 Brand assets — logos and banners

Everything below lives in `public/assets/`, and each folder has a README in it repeating this table. Drop a file in with the exact name listed and it appears on the live site immediately on next load — no code change, no redeploy step beyond your normal one, nothing to wire up.

Every one of these is optional. Until a file is uploaded, the site keeps working exactly as it does now — the plain "CA" mark stands in for the logo, and page headers keep their current plain background. Nothing breaks either way.

### Logo — `public/assets/logo/`

| File | Used | Dimensions | Format |
|---|---|---|---|
| `logo-wordmark.png` | Header, on the white background | Export at 2–3× display size — roughly **720×180px**, matching your logo's real proportions | PNG, transparent background |
| `logo-wordmark-white.png` | Footer, on the navy band | Same size as above, white/reversed version of the same mark | PNG, transparent background |

If your logo isn't that roughly 4:1 wide-to-tall ratio, that's fine — export at whatever your actual proportions are; the site scales it to a fixed 34px height and lets the width follow naturally, both in the header and the footer.

### Three exceptions — these go in `public/` directly, not in `/assets`

Browsers and some crawlers look for these at fixed root-level locations regardless of what the page's HTML says, so they can't be moved into a subfolder:

| File | Used | Dimensions | Format |
|---|---|---|---|
| `favicon.ico` | Browser tab icon | 32×32 (multi-size .ico if you have design tooling that produces one) | ICO |
| `apple-touch-icon.png` | iOS home-screen icon | 180×180, no transparency (iOS adds rounding and a background itself) | PNG |
| `logo.png` | Not visible on the site — this is what Google reads for your Organization logo in search results and knowledge panels | 512×512, square | PNG |

All three can come from the same source mark, just exported at different sizes. If you only have one high-resolution square version of your icon, send it and I can generate all three properly rather than you resizing by hand.

### Banners — `public/assets/banners/`

Every listing and interior page — Services, About, Careers, Contact, Insights, plus each individual service and article — has a **page-head band** at the top: the title, a breadcrumb, sometimes a short line of copy. Right now that band is a plain colour. Drop in a matching file and it becomes a photo with a navy tint over it (so the white heading text stays readable, and it still reads as *your* brand rather than a random stock photo) — this treatment is deliberate: see docs/design-spec.md §2.1 on why the site avoids generic photography elsewhere.

| File | Page | Dimensions | Format |
|---|---|---|---|
| `banner-about.jpg` | `/about` | 1920×960px | JPG |
| `banner-careers.jpg` | `/careers` | 1920×960px | JPG |
| `banner-contact.jpg` | `/contact` | 1920×960px | JPG |
| `banner-insights.jpg` | `/insights` (the index) | 1920×960px | JPG |
| `banner-services.jpg` | `/services` (the index) | 1920×960px | JPG |
| `banner-services-<slug>.jpg` | An individual service page, e.g. `banner-services-debt-collection.jpg` | 1920×960px | JPG |
| `banner-insights-<slug>.jpg` | An individual article, e.g. `banner-insights-cutting-arrears-before-they-start.jpg` | 1920×960px | JPG |

All at a **2:1 ratio**, aim under 300KB each. That ratio gives enough headroom to crop safely across phone, tablet and desktop widths — the image is centred and cropped to cover, so keep whatever matters most (a face, a sign) away from the far left/right edges.

Service and article slugs are whatever's in the URL — check `/services` or `/insights` for the exact spelling, or open `content/services.ts` / `content/insights.ts` (or the CMS, once you're using it) to see every current slug at once.

**The home page hero is deliberately not on this list.** It's built around the ledger of services rather than a photo, on purpose — see design-spec.md §2.1 and §11.4. If you want a photo there too, say so and I'll design it in properly rather than bolt it on; it changes more of the layout than the banners above do.

### Team photos work differently

Once the CMS is connected (§6), leadership photos are uploaded **through `/admin`**, on the Team member's own page — not dropped into a folder. See §6.7.

---

## 7. Deploying

### Option A — Vercel

1. Push the repository to GitHub.
2. Import it at **vercel.com**. Next.js is detected; no build configuration needed.
3. Add every variable from `.env.example` under **Settings → Environment Variables**.
4. Point `collectionafrica.co.ke` at Vercel via the DNS records it gives you.

Two caveats:

- Vercel's filesystem is ephemeral, so **CMS uploads must go to S3 or R2** (§6.8). Local uploads disappear on the next deploy.
- Vercel runs serverless, so the in-memory rate limiter resets between invocations (§7.3).

### Option B — your own VPS *(recommended if you're already hosting)*

Everything on one machine: the site, the CMS, the uploads and the rate limiter. Simpler and cheaper, and the database sits next to the app instead of an ocean away.

```bash
npm ci
npm run build
npm run start        # listens on :3000
```

Run it under `pm2` or a `systemd` unit, and put Nginx in front for TLS.

**Back up the database.** The CMS is now where your content lives. A nightly `pg_dump` to off-server storage, with a restore you have actually tested, is not optional.

Also add `Cache-Control: no-store` for `/admin` at the Nginx level, and consider restricting `/admin` to your office IP range if that is practical.

### Option C — cPanel (shared or reseller hosting)

This works, but it's the most fiddly of the three, because cPanel runs Node apps through **Passenger**, which expects a specific setup Next.js doesn't provide out of the box. That's already handled — `server.js` in the project root exists for exactly this. Below is the rest.

**Before you start, check three things with your host:**

1. **cPanel has "Setup Node.js App"** (sometimes labelled "Node.js Selector"). If it's not in your cPanel dashboard, your hosting plan doesn't include it — ask your host, or use Option A or B instead.
2. **You have SSH or Terminal access.** The UI's "Run NPM Install" button alone isn't enough — you need a shell to run the build and the CMS seed. If you weren't given SSH access, ask your host to enable it (common on Business-tier shared plans, sometimes needs a support ticket on lower tiers).
3. **A Postgres database.** Look for a **"PostgreSQL Databases"** icon in cPanel. Most shared hosting only offers MySQL, in which case use a hosted Postgres instead — Neon or Supabase, same as in §6.1. That's not a downgrade; keeping the database off the same small shared box is generally better anyway.

**Also be aware:** `next build` compiles both the website and the CMS admin panel, which is a genuinely heavy build for the low RAM ceiling some shared hosting plans enforce. If the build hangs or gets killed partway through, see the troubleshooting note at the end of this section before assuming something's broken.

**1. Create the Node.js app.**
cPanel → **Setup Node.js App** → **Create Application**.

- **Node.js version** — the highest available, and at minimum **20.9**.
- **Application mode** — Production.
- **Application root** — a folder *outside* `public_html`, e.g. `collectionafrica_app`. Passenger and cPanel's own routing handle exposing it at your domain; it should not live inside your public web folder.
- **Application URL** — your domain (or subdomain, if that's where this goes).
- **Application startup file** — `server.js`.

Click Create. cPanel wires up the Passenger/Apache routing for you automatically.

**2. Upload the project.**
Upload `cal-web.zip` and extract it **inside cPanel's File Manager** (its own "Extract" tool, not a Mac/Windows unzip app first) directly into the application root folder you just created, so `server.js`, `package.json` and everything else sit at the top level of that folder — not nested inside an extra `cal-web/` subfolder. Using File Manager's extractor (or `unzip` over SSH) avoids the dotfile-stripping problem from earlier in this conversation; a desktop unzip tool can still silently drop `.env.example`-style files before they even reach the server.

**3. Set environment variables.**
Same page, **Setup Node.js App → your app → Environment Variables**. Add every value from `.env.example` here — `DATABASE_URI`, `PAYLOAD_SECRET`, the SMTP block, Tawk IDs, `ANTHROPIC_API_KEY`, and importantly `NEXT_PUBLIC_SITE_URL` set to your real domain. This UI table is generally the safer place for these on shared hosting, rather than a `.env` file sitting in a folder other tenants on the same box could conceivably enumerate.

**4. Build, from SSH.**
The cPanel page shows a line like:

```bash
source /home/yourusername/nodevenv/collectionafrica_app/20/bin/activate && cd /home/yourusername/collectionafrica_app
```

Copy that exactly — it's specific to your account and app name — run it over SSH, then:

```bash
npm ci                 # or npm install, if there's no package-lock.json yet
npm run build
npm run cms:seed       # only once, the first time — see §6.1
```

**Never upload `node_modules` from your own computer.** `sharp`, which the CMS uses for image processing, contains platform-specific compiled binaries — the version installed on your Mac won't run on the server's Linux, and it fails in a way that looks unrelated (usually a `sharp` or `libvips` error deep in an image-upload stack trace). Always run `npm install` **on the server**.

**5. Restart.**
Back in the cPanel UI, hit **Restart**. Do this again after any future environment-variable change — those aren't picked up live.

**6. SSL.**
cPanel → **SSL/TLS Status** → run **AutoSSL** if it hasn't already issued a free Let's Encrypt certificate for the domain.

**One real advantage over Vercel here:** cPanel gives you a persistent filesystem, so CMS media uploads to `public/uploads` (§6.8) just work — no S3/R2 needed unless you specifically want one. The in-memory rate limiter (§7.3) is fine here too, for the same reason: one persistent process, not a serverless one that resets.

**One thing I can't fully promise:** the on-site AI assistant streams its reply token-by-token. Whether Passenger passes that stream through live or buffers it into one lump depends on your host's exact Passenger configuration, and I can't test that from here. If replies from the assistant appear to arrive all at once rather than typing out, that's what's happening — it still works, just less smoothly. Tell me if you hit this and I'll swap that one route to a non-streaming response, which is a small, contained change.

**If the build fails or the process gets killed partway through** — check the app's error log (cPanel → Setup Node.js App → your app → the log link) for an out-of-memory message. Some shared plans cap a process around 512MB–1GB, which `next build` can exceed on a project this size. If that happens: build the project on your own machine instead (or in a free CI runner like GitHub Actions, which is closer to the server's Linux environment than your Mac is), then upload the resulting `.next`, `node_modules`, `public` and `package.json` rather than building in place. Ask if you want a walkthrough of that specifically — it's a different enough process that it's worth its own set of steps rather than a footnote.

### 7.1 Before you go live

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain, no trailing slash
- [ ] `PAYLOAD_SECRET` set to a fresh value, different from development
- [ ] `DATABASE_URI` points at the production database, in the same region as the app
- [ ] `npm run cms:seed` run once against production
- [ ] First admin user created, and the seed credentials removed from the environment
- [ ] Database backups scheduled, and a restore tested
- [ ] `/admin` loads and rejects a wrong password
- [ ] Contact form tested on production
- [ ] Careers form tested with a real PDF
- [ ] Every **TODO(client)** placeholder replaced — search the codebase for `TODO(client)`
- [ ] `/privacy` and `/terms` reviewed by your advocate and the draft banner removed
- [ ] Leadership placeholders in `content/team.ts` replaced
- [ ] `robots.txt` and `sitemap.xml` load correctly
- [ ] Assistant tested with a pricing question — it must decline

### 7.2 Removing the legal draft banners

Delete the `<p className="notice notice--bad">…</p>` block at the top of `app/privacy/page.tsx` and `app/terms/page.tsx` once your advocate signs off.

### 7.3 Scaling the rate limiter

`lib/rate-limit.ts` holds counters in memory. Fine for one server; ineffective across serverless instances. If you deploy to Vercel and start seeing spam, swap it for Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Keep the same `rateLimit(key, limit, windowMs)` signature and no calling code changes.

---

## 8. Post-launch SEO checklist

**Week one**

- Search Console verified, sitemap submitted
- Google Business Profile claimed for Nairobi, Kisumu and Nakuru
- Run PageSpeed Insights on the home page and one service page
- Test three service pages in the Rich Results Test — FAQ schema should validate

**Month one**

- Check **Pages → Not indexed** for legacy 404s and add redirects
- List in Kenyan directories: Yellow Pages Kenya, BusinessList, Kenya Chamber of Commerce
- Confirm your LinkedIn company page links to the site

**Ongoing**

- One insight article a month, written against a real question a client asked
- Watch **Performance → Queries** for terms you rank 5–15 for; those are the cheapest wins
- Re-crawl the site in Tawk AI after publishing

---

## 9. Troubleshooting

**Forms return "We couldn't send that"**
Check the server logs for the SMTP error. Usually: wrong port/secure combination (465 needs `SMTP_SECURE=true`, 587 needs `false`), a Gmail account password used instead of an App Password, or — for Microsoft 365 specifically — SMTP AUTH not yet enabled on the mailbox, MFA blocking it, or (from December 2026 onward) Microsoft's Basic Auth retirement itself. See §2.3a.

**Emails send but land in spam**
SPF, DKIM or DMARC missing. See §2.5.

**Assistant button missing**
`ANTHROPIC_API_KEY` unset, or `NEXT_PUBLIC_ENABLE_ASSISTANT=false`. Note that any `NEXT_PUBLIC_*` change requires a rebuild, not just a restart — those are baked in at build time.

**Assistant replies "I couldn't answer that just now"**
Usually a billing issue — check credit balance and spend limit in the Anthropic console. The server log has the real error.

**Tawk bubble doesn't appear**
Property ID or widget ID wrong. Compare against the embed URL in Tawk's dashboard. Both values are required.

**A new article doesn't show**
Check it is **published**, not saved as a draft. Drafts are invisible to the public site by design.

**Everything shows the old content, not what I edited**
`DATABASE_URI` or `PAYLOAD_SECRET` is missing, so the site has fallen back to the files in `/content`. Check the server log — it prints a line when it cannot reach the CMS.

**`/admin` shows an error or a blank page**
Usually the database is unreachable, or the tables have not been created. Run `npm run cms:seed`. If you changed a collection's fields, run `npm run cms:types` and restart.

**Pages take 10+ seconds locally**
That is dev-mode compilation, not the site. See §1.1 — and run `npm run build && npm run start` to see the real speed.

**`npm install` fails with `ERESOLVE unable to resolve dependency tree`**
Next.js and Payload have drifted out of the compatible range in `package.json` — almost always because one was bumped without the other. Don't reach for `--legacy-peer-deps`; it will install, but the admin panel can then fail in ways that are much harder to diagnose than the install error. Instead check the current compatible range on payloadcms.com/docs and update `next` and every `@payloadcms/*` package together to match, as exact versions.

**Old URL shows a 404**
Add it to `redirects()` in `next.config.mjs` and redeploy.

---

## 10. Costs

| Item | Typical |
|---|---|
| Hosting — Vercel Hobby | Free (Pro ~$20/month if you need team access or more bandwidth) |
| Postgres — Neon / Supabase free tier | Free, adequate for this site |
| Object storage — Cloudflare R2 | ~$0 at this volume, no egress fees |
| Hosting — small VPS | $6–12/month |
| Domain | ~KSh 2,000/year |
| Tawk.to live chat | Free |
| Tawk.to AI assist | Paid add-on — check current pricing |
| Anthropic API | A few dollars a month at normal traffic; capped by your spend limit |
| Google Analytics / GTM / Search Console | Free |
