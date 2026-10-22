import { MODEL, aiEnabled, anthropic, assistantSystemPrompt } from "@/lib/ai";
import { buildIndex, shortlist } from "@/lib/knowledge";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!aiEnabled()) {
    return new Response("The assistant is not configured yet.", { status: 503 });
  }

  const ip = clientIp(req);
  if (!rateLimit(`chat:${ip}`, 25, 15 * 60 * 1000).ok) {
    return new Response(
      "You've asked a lot of questions in a short time. Take a break, or call +254 116 028 888.",
      { status: 429 },
    );
  }

  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-8);

  if (!messages.length || messages.at(-1)?.role !== "user") {
    return new Response("No question supplied.", { status: 400 });
  }

  // Ground the answer on the pages most relevant to the latest question.
  const question = messages.at(-1)!.content;
  const context = shortlist(question, (await buildIndex()), 5)
    .map((d) => `### ${d.title} (${d.path})\n${d.text}`)
    .join("\n\n");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const run = anthropic().messages.stream({
          model: MODEL,
          max_tokens: 700,
          temperature: 0.2,
          system: assistantSystemPrompt(context),
          messages,
        });

        run.on("text", (text) => controller.enqueue(encoder.encode(text)));
        await run.finalMessage();
        controller.close();
      } catch (err) {
        console.error("[chat] stream failed", err);
        controller.enqueue(
          encoder.encode("Sorry — I couldn't answer that just now. Please try again."),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
