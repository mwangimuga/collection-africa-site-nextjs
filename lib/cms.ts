import { services as staticServices, type Service } from "@/content/services";
import { posts as staticPosts, type Post, type Block } from "@/content/insights";
import { jobs as staticJobs, type Job } from "@/content/jobs";
import { leadership as staticTeam, type Member } from "@/content/team";
import { offices as staticOffices, site as staticSite, type Office } from "@/content/site";

/**
 * The content adapter.
 *
 * Every page reads through these functions. If Payload is configured
 * (DATABASE_URI + PAYLOAD_SECRET present and reachable) they return live CMS
 * content. If it is not, they return the typed modules in /content.
 *
 * Two things this buys us:
 *  - the site builds and runs with no database at all, so a developer can work
 *    on the front end without standing up Postgres
 *  - a CMS outage degrades to the last known-good content instead of a 500
 *
 * The /content modules are also the seed data — `npm run cms:seed` pushes them
 * into Payload on first run.
 */

const cmsConfigured = () => Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);

type PayloadClient = {
  find: (args: Record<string, unknown>) => Promise<{ docs: Record<string, unknown>[] }>;
  findGlobal: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

let clientPromise: Promise<PayloadClient | null> | null = null;

export async function cms(): Promise<PayloadClient | null> {
  if (!cmsConfigured()) return null;

  clientPromise ??= (async () => {
    try {
      const [{ getPayload }, configModule] = await Promise.all([
        import("payload"),
        import("@payload-config"),
      ]);
      return (await getPayload({ config: configModule.default })) as unknown as PayloadClient;
    } catch (err) {
      console.error("[cms] could not connect, falling back to static content", err);
      return null;
    }
  })();

  return clientPromise;
}

/** Payload stores simple string lists as [{ text }]. Flatten them. */
const flatten = (rows: unknown): string[] =>
  Array.isArray(rows) ? rows.map((r) => String((r as { text?: string }).text ?? "")).filter(Boolean) : [];

const pairs = (rows: unknown): { title: string; body: string }[] =>
  Array.isArray(rows)
    ? rows.map((r) => ({
        title: String((r as { title?: string }).title ?? ""),
        body: String((r as { body?: string }).body ?? ""),
      }))
    : [];

/* ── Services ─────────────────────────────────────────────── */

function toService(doc: Record<string, unknown>): Service {
  return {
    slug: String(doc.slug),
    name: String(doc.name),
    summary: String(doc.summary),
    audience: String(doc.audience),
    intro: flatten(doc.intro),
    process: pairs(doc.process),
    capabilities: pairs(doc.capabilities),
    outcomes: flatten(doc.outcomes),
    faqs: Array.isArray(doc.faqs)
      ? doc.faqs.map((f) => ({
          q: String((f as { q?: string }).q ?? ""),
          a: String((f as { a?: string }).a ?? ""),
        }))
      : [],
    keywords: flatten(doc.keywords),
  };
}

export async function getServices(): Promise<Service[]> {
  const client = await cms();
  if (!client) return staticServices;

  try {
    const { docs } = await client.find({
      collection: "services",
      limit: 50,
      sort: "order",
      depth: 0,
      where: { _status: { equals: "published" } },
    });
    return docs.length ? docs.map(toService) : staticServices;
  } catch (err) {
    console.error("[cms] getServices failed", err);
    return staticServices;
  }
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

/* ── Insights ─────────────────────────────────────────────── */

/** Payload blocks carry a blockType; our renderer expects `type`. */
function toBlock(block: Record<string, unknown>): Block | null {
  const type = String(block.blockType ?? block.type ?? "");
  switch (type) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
      return { type, text: String(block.text ?? "") } as Block;
    case "ul":
      return { type: "ul", items: flatten(block.items) };
    default:
      return null;
  }
}

function toPost(doc: Record<string, unknown>): Post {
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    description: String(doc.description),
    category: String(doc.category) as Post["category"],
    date: String(doc.date).slice(0, 10),
    author: String(doc.author ?? "Collection Africa"),
    readingMinutes: Number(doc.readingMinutes ?? 5),
    body: Array.isArray(doc.body)
      ? doc.body.map((b) => toBlock(b as Record<string, unknown>)).filter((b): b is Block => b !== null)
      : [],
    keywords: flatten(doc.keywords),
  };
}

export async function getPosts(): Promise<Post[]> {
  const client = await cms();
  if (!client) return staticPosts;

  try {
    const { docs } = await client.find({
      collection: "posts",
      limit: 200,
      sort: "-date",
      depth: 0,
      where: { _status: { equals: "published" } },
    });
    return docs.length ? docs.map(toPost) : staticPosts;
  } catch (err) {
    console.error("[cms] getPosts failed", err);
    return staticPosts;
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

/* ── Jobs ─────────────────────────────────────────────────── */

function toJob(doc: Record<string, unknown>): Job {
  return {
    slug: String(doc.slug),
    title: String(doc.title),
    location: String(doc.location),
    type: String(doc.type) as Job["type"],
    department: String(doc.department),
    postedAt: String(doc.postedAt).slice(0, 10),
    closesAt: doc.closesAt ? String(doc.closesAt).slice(0, 10) : undefined,
    summary: String(doc.summary),
    responsibilities: flatten(doc.responsibilities),
    requirements: flatten(doc.requirements),
  };
}

export async function getJobs(): Promise<Job[]> {
  const client = await cms();
  if (!client) return staticJobs;

  try {
    const { docs } = await client.find({
      collection: "jobs",
      limit: 100,
      sort: "-postedAt",
      depth: 0,
      where: { _status: { equals: "published" } },
    });
    // An empty vacancy list is a legitimate state, so don't fall back here.
    return docs.map(toJob);
  } catch (err) {
    console.error("[cms] getJobs failed", err);
    return staticJobs;
  }
}

/* ── Team ─────────────────────────────────────────────────── */

export async function getTeam(): Promise<Member[]> {
  const client = await cms();
  if (!client) return staticTeam;

  try {
    const { docs } = await client.find({ collection: "team", limit: 50, sort: "order", depth: 1 });
    return docs.length
      ? docs.map((d) => ({
          name: String(d.name),
          role: String(d.role),
          bio: String(d.bio),
          photo: (d.photo as { url?: string } | undefined)?.url,
          linkedin: d.linkedin ? String(d.linkedin) : undefined,
        }))
      : staticTeam;
  } catch (err) {
    console.error("[cms] getTeam failed", err);
    return staticTeam;
  }
}

/* ── Company details ──────────────────────────────────────── */

export type CompanyDetails = typeof staticSite & { offices: Office[] };

export async function getCompany(): Promise<CompanyDetails> {
  const fallback = { ...staticSite, offices: staticOffices };
  const client = await cms();
  if (!client) return fallback;

  try {
    const doc = await client.findGlobal({ slug: "settings", depth: 0 });
    if (!doc || !doc.email) return fallback;

    return {
      ...staticSite,
      phone: String(doc.phone ?? staticSite.phone),
      phoneDisplay: String(doc.phoneDisplay ?? staticSite.phoneDisplay),
      email: String(doc.email ?? staticSite.email),
      careersEmail: String(doc.careersEmail ?? staticSite.careersEmail),
      hours: String(doc.hours ?? staticSite.hours),
      linkedin: String(doc.linkedin ?? staticSite.linkedin),
      offices: Array.isArray(doc.offices) && doc.offices.length
        ? (doc.offices as Record<string, unknown>[]).map((o) => ({
            city: String(o.city),
            label: String(o.label),
            street: String(o.street),
            locality: String(o.locality),
            phone: o.phone ? String(o.phone) : undefined,
            isHeadOffice: Boolean(o.isHeadOffice),
          }))
        : staticOffices,
    };
  } catch (err) {
    console.error("[cms] getCompany failed", err);
    return fallback;
  }
}
