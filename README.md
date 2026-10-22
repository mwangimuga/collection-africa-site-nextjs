# Collection Africa — website

Next.js 15 rebuild of collectionafrica.co.ke. Server-rendered for SEO, with a built-in CMS, working forms, an applicant tracking pipeline, an AI assistant grounded on the site's own content, and AI search.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Runs on http://localhost:3000. Works with an empty `.env.local` and **no database** — content comes from `/content`, and forms and AI stay dormant until you add credentials.

To turn on the CMS at `/admin`, add `DATABASE_URI` and `PAYLOAD_SECRET`, then `npm run cms:seed`. Full walkthrough in the user guide, §6.

**Pages slow in `npm run dev`?** That is Next.js compiling routes on first visit, not the site. See the user guide, §1.1.

## Documentation

- **[docs/user-guide.md](docs/user-guide.md)** — connecting SMTP, Tawk.to, Claude, analytics; editing content; deploying. Start here.
- **[docs/design-spec.md](docs/design-spec.md)** — design system, IA, SEO strategy, what changed from the previous build, and open questions.

## Layout

```
app/(frontend)/   the public website
app/(payload)/    the CMS admin panel and its API
app/api/          forms, AI chat, AI search, social images
cms/              CMS collections and access rules
components/       header, footer, forms, assistant, widgets
content/          seed data and the no-database fallback
lib/              CMS adapter, SEO, mail, validation, rate limiting, AI
scripts/seed.ts   pushes /content into the CMS
docs/             the two documents above
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the build |
| `npm run typecheck` | Type check without building |
| `npm run cms:seed` | Push `/content` into the CMS (safe to re-run) |
| `npm run cms:types` | Regenerate CMS TypeScript types after changing a collection |
| `npm run dev:webpack` | Dev server without Turbopack, if you hit a Turbopack bug |

## Before going live

Search the codebase for `TODO(client)` and replace every placeholder. The checklist is in the user guide, §7.1.
