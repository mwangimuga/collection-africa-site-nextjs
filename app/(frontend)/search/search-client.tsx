"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Result = { title: string; path: string; excerpt: string };
type Source = { title: string; path: string };

export function SearchClient() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";

  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const run = useCallback(async (q: string) => {
    if (q.trim().length < 2) return;
    setState("loading");
    setAnswer(null);
    setSources([]);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      });
      const body = await res.json();

      if (!res.ok) {
        setState("error");
        return;
      }

      setResults(body.results ?? []);
      setAnswer(body.answer ?? null);
      setSources(body.sources ?? []);
      setState("done");
    } catch {
      setState("error");
    }
  }, []);

  // Run immediately when arriving with ?q= from elsewhere.
  useEffect(() => {
    if (initial) void run(initial);
  }, [initial, run]);

  return (
    <div className="stack">
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
      >
        <label className="field">
          <span className="visually-hidden">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. how do you handle disputed balances?"
            aria-label="Search the site"
          />
        </label>
        <div>
          <button type="submit" className="btn btn--primary" disabled={state === "loading"}>
            {state === "loading" ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {state === "error" && (
        <p className="notice notice--bad" role="alert">
          Search isn&apos;t responding. Try again, or browse the services pages directly.
        </p>
      )}

      {answer && (
        <div className="panel" style={{ background: "var(--paper)", marginTop: "2rem" }}>
          <h3 style={{ fontSize: "var(--step-1)" }}>Short answer</h3>
          <p style={{ color: "var(--ink)" }}>{answer}</p>
          {sources.length > 0 && (
            <p className="meta" style={{ marginTop: "1rem" }}>
              From:{" "}
              {sources.map((s, i) => (
                <span key={s.path}>
                  {i > 0 && ", "}
                  <Link href={s.path}>{s.title}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      {state === "done" && results.length === 0 && (
        <p className="lede" style={{ marginTop: "2rem" }}>
          Nothing on the site matches that. <Link href="/contact">Ask the team directly</Link>.
        </p>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "var(--step-2)" }}>Pages</h2>
          <div className="ledger">
            {results.map((r) => (
              <Link key={r.path} href={r.path} className="ledger-row">
                <p className="ledger-row__name">{r.title}</p>
                <span className="ledger-row__value">Open</span>
                <p className="ledger-row__note">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
