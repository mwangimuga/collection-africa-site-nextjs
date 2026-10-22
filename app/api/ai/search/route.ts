import { NextResponse } from "next/server";
import { MODEL, aiEnabled, anthropic, searchSystemPrompt } from "@/lib/ai";
import { buildIndex, shortlist } from "@/lib/knowledge";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`search:${ip}`, 30, 15 * 60 * 1000).ok) {
    return NextResponse.json({ message: "Too many searches. Try again shortly." }, { status: 429 });
  }

  let query = "";
  try {
    query = String((await req.json()).q ?? "").slice(0, 300).trim();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (query.length < 2) {
    return NextResponse.json({ message: "Enter something to search for." }, { status: 400 });
  }

  const docs = (await buildIndex());
  const hits = shortlist(query, docs, 6);

  // Keyword results always come back, with or without an API key. The AI
  // summary is an enhancement on top, never the only thing the page shows.
  const results = hits.map((d) => ({
    title: d.title,
    path: d.path,
    excerpt: d.text.replace(/\s+/g, " ").slice(0, 190).trim() + "…",
  }));

  if (!aiEnabled() || process.env.NEXT_PUBLIC_ENABLE_AI_SEARCH === "false") {
    return NextResponse.json({ results, answer: null, sources: [] });
  }

  try {
    const context = hits.map((d) => `### ${d.title} (${d.path})\n${d.text.slice(0, 2500)}`).join("\n\n");

    const completion = await anthropic().messages.create({
      model: MODEL,
      max_tokens: 500,
      temperature: 0,
      system: searchSystemPrompt,
      messages: [{ role: "user", content: `Query: ${query}\n\nPage extracts:\n${context}` }],
    });

    const raw = completion.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw) as { answer: string; sources: { title: string; path: string }[] };

    return NextResponse.json({
      results,
      answer: typeof parsed.answer === "string" ? parsed.answer : null,
      sources: Array.isArray(parsed.sources) ? parsed.sources.slice(0, 3) : [],
    });
  } catch (err) {
    console.error("[search] AI summary failed", err);
    // Degrade to keyword results rather than failing the search.
    return NextResponse.json({ results, answer: null, sources: [] });
  }
}
