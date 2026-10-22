import { getCompany, getJobs, getPosts, getServices } from "@/lib/cms";

export type Doc = { title: string; path: string; text: string };

/**
 * Flattens every page of the site into plain text.
 *
 * Used for two things:
 *  - grounding the on-site Claude assistant (/api/chat)
 *  - answering AI search queries (/api/search)
 *
 * Because the content layer is typed TypeScript, this index rebuilds itself
 * whenever you add a service, post or job. There is nothing to re-sync.
 */
export async function buildIndex(): Promise<Doc[]> {
  const [services, posts, jobs, site] = await Promise.all([
    getServices(),
    getPosts(),
    getJobs(),
    getCompany(),
  ]);
  const offices = site.offices;
  const docs: Doc[] = [];

  docs.push({
    title: "Collection Africa — overview",
    path: "/",
    text: [
      `${site.legalName} has operated in Kenya since ${site.founded}.`,
      site.description,
      `Phone ${site.phoneDisplay}. Email ${site.email}. Hours: ${site.hours}.`,
      `Offices: ${offices.map((o) => `${o.city} (${o.street})`).join("; ")}.`,
      `Services offered: ${services.map((s) => s.name).join(", ")}.`,
    ].join(" "),
  });

  for (const s of services) {
    docs.push({
      title: s.name,
      path: `/services/${s.slug}`,
      text: [
        s.summary,
        `Who it is for: ${s.audience}`,
        ...s.intro,
        `How it works: ${s.process.map((p, i) => `${i + 1}. ${p.title} — ${p.body}`).join(" ")}`,
        `What is included: ${s.capabilities.map((c) => `${c.title} — ${c.body}`).join(" ")}`,
        `Outcomes: ${s.outcomes.join("; ")}`,
        ...s.faqs.map((f) => `Q: ${f.q} A: ${f.a}`),
      ].join("\n"),
    });
  }

  for (const p of posts) {
    docs.push({
      title: p.title,
      path: `/insights/${p.slug}`,
      text: [
        p.description,
        ...p.body.map((b) =>
          b.type === "ul" ? b.items.join(". ") : "text" in b ? b.text : "",
        ),
      ].join("\n"),
    });
  }

  for (const j of jobs) {
    docs.push({
      title: `Careers — ${j.title}`,
      path: `/careers#${j.slug}`,
      text: [
        `${j.title}, ${j.type}, based in ${j.location}, ${j.department}.`,
        j.summary,
        `Responsibilities: ${j.responsibilities.join("; ")}.`,
        `Requirements: ${j.requirements.join("; ")}.`,
      ].join(" "),
    });
  }

  docs.push({
    title: "Contact Collection Africa",
    path: "/contact",
    text: `Enquiries: ${site.email}, ${site.phoneDisplay}. Careers: ${site.careersEmail}. ${site.hours}. Offices in ${offices.map((o) => o.city).join(", ")}.`,
  });

  return docs;
}

/**
 * Cheap lexical prefilter so we only send relevant pages to the model.
 * Keeps token cost and latency down, and keeps answers on-topic.
 */
export function shortlist(query: string, docs: Doc[], take = 6): Doc[] {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (!terms.length) return docs.slice(0, take);

  const scored = docs.map((doc) => {
    const haystack = `${doc.title} ${doc.text}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (doc.title.toLowerCase().includes(term)) score += 5;
      const matches = haystack.split(term).length - 1;
      score += Math.min(matches, 8);
    }
    return { doc, score };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits : scored).slice(0, take).map((s) => s.doc);
}
