"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SEEDS = [
  "What does the debt collection process involve?",
  "Can you help a county raise own-source revenue?",
  "Is skip tracing legal in Kenya?",
  "How do I get a proposal?",
];

const OPENER =
  "Hello. I can answer questions about what Collection Africa does — recovery, county revenue, SMS, training and investigations. I can't discuss fees or specific accounts.";

/**
 * On-site assistant, grounded on the site's own content via /api/chat.
 *
 * Deliberately narrow: it answers from the website, refuses pricing and
 * legal advice, and hands off to the contact page. See lib/ai.ts for the
 * operating rules and docs/user-guide.md section 4 to change them.
 */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: OPENER }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("input")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the last 8 turns go up — keeps latency and cost predictable.
        body: JSON.stringify({ messages: next.slice(-8) }),
      });

      if (!res.ok || !res.body) throw new Error(String(res.status));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      // Stream tokens straight into the last message.
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "That didn't go through. Try again, or reach the team directly on +254 116 028 888.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="assistant-launch" onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" strokeLinejoin="round" />
        </svg>
        Ask about our services
      </button>
    );
  }

  return (
    <div className="assistant" role="dialog" aria-label="Collection Africa assistant" ref={panelRef}>
      <div className="assistant__head">
        <div>
          <strong>Ask Collection Africa</strong>
          <span>Answers from this website</span>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="assistant__log" ref={logRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg--${m.role === "user" ? "me" : "bot"}`}>
            {m.content || (busy ? "…" : "")}
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <div className="assistant__seeds">
          {SEEDS.map((s) => (
            <button key={s} type="button" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      <form
        className="assistant__form"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question"
          aria-label="Your question"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>

      <p className="assistant__foot">
        Automated assistant. Don't share debtor details or ID numbers here.
      </p>
    </div>
  );
}
