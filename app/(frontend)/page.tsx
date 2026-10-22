import Link from "next/link";
import { getCompany, getPosts, getServices } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ethical debt recovery and revenue services in Kenya",
  description:
    "Collection Africa recovers overdue debt, rebuilds county revenue registers and trains credit teams across Kenya. Licensed, data-protection compliant, operating since 2001.",
  path: "/",
  keywords: [
    "debt collection Kenya",
    "debt recovery agency Nairobi",
    "county revenue collection",
    "credit management training Kenya",
    "skip tracing Kenya",
  ],
});

export default async function HomePage() {
  const [services, posts, site] = await Promise.all([getServices(), getPosts(), getCompany()]);
  const offices = site.offices;
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const recoveryProcess = services.find((s) => s.slug === "debt-collection")?.process ?? [];

  return (
    <>
      {/* ── Hero: the ledger is the hero. No invented metrics. ─────── */}
      <section className="hero">
        <div className="shell hero__grid">
          <div className="reveal">
            <span className="hero__since">Operating in Kenya since {site.founded}</span>
            <h1>Debt recovered without burning the relationship.</h1>
            <div className="hero__rule" />
            <p className="lede">
              We recover what you are owed by talking to people rather than threatening them,
              and we document every step so the outcome holds up — to your auditor, your board
              and, if it comes to it, a court.
            </p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
              <Link href="/ethics" className="btn btn--outline">Read our recovery charter</Link>
            </div>
          </div>

          <div className="reveal">
            <div className="hero__ledger-head">
              <span>What we do</span>
              <span>Five practices</span>
            </div>
            <div className="ledger">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="ledger-row">
                  <p className="ledger-row__name">{s.name}</p>
                  <span className="ledger-row__value">View</span>
                  <p className="ledger-row__note">{s.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Position ─────────────────────────────────────────────── */}
      <section className="band band--paper">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">Why clients move their portfolios to us</span>
            <h2>Recovery is a conversation, not a campaign.</h2>
            <p className="lede">
              Most overdue accounts are cash-flow problems, not fraud. Treating them that way
              recovers more money, faster, and leaves you with a customer you can still sell to.
            </p>
          </div>

          <div className="grid grid--3">
            <article className="panel">
              <h3>Compliance is the method</h3>
              <p>
                Data Protection Act obligations, permitted contact hours and dispute handling are
                built into how our collectors work, not audited afterwards.
              </p>
            </article>
            <article className="panel">
              <h3>Everything is on the record</h3>
              <p>
                Every call, promise and payment is logged the same day. You get an evidence file,
                not a summary written from memory six months later.
              </p>
            </article>
            <article className="panel">
              <h3>We work where the debtor is</h3>
              <p>
                Offices in {offices.map((o) => o.city).join(", ")} and field teams across the
                counties, so contact does not depend on someone answering a Nairobi number.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Process: a genuine sequence, so it is numbered ────────── */}
      <section className="band">
        <div className="shell split">
          <div>
            <span className="kicker">From handover to remittance</span>
            <h2>How an account moves through our desk.</h2>
            <p>
              The same sequence applies whether you send us one account or a book of forty
              thousand. What changes is the scale, not the standard.
            </p>
            <div className="btn-row">
              <Link href="/services/debt-collection" className="btn btn--outline">
                See the full process
              </Link>
            </div>
          </div>

          <div className="steps">
            {recoveryProcess.slice(0, 5).map((step) => (
              <div className="step" key={step.title}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sectors ──────────────────────────────────────────────── */}
      <section className="band band--navy">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">Who we work with</span>
            <h2>Built for organisations that carry other people&apos;s money.</h2>
          </div>
          <div className="grid grid--2">
            <ul className="marks">
              <li>Banks, microfinance institutions and SACCOs</li>
              <li>County governments and public agencies</li>
              <li>Insurers and healthcare providers</li>
            </ul>
            <ul className="marks">
              <li>Schools, universities and training institutions</li>
              <li>Landlords, property managers and utilities</li>
              <li>Corporates with large trade receivables books</li>
            </ul>
          </div>
          <div className="btn-row">
            <Link href="/contact" className="btn btn--light">Talk to our team</Link>
          </div>
        </div>
      </section>

      {/* ── Insights ─────────────────────────────────────────────── */}
      <section className="band">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">Insights</span>
            <h2>What we have learned doing this in Kenya.</h2>
          </div>
          <div className="ledger">
            {latest.map((p) => (
              <Link key={p.slug} href={`/insights/${p.slug}`} className="ledger-row">
                <p className="ledger-row__name">{p.title}</p>
                <span className="ledger-row__value">
                  {new Date(p.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
                <p className="ledger-row__note">{p.description}</p>
              </Link>
            ))}
          </div>
          <div className="btn-row">
            <Link href="/insights" className="btn btn--outline">All insights</Link>
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────── */}
      <section className="band band--paper band--tight">
        <div className="shell split">
          <div>
            <h2>Tell us what you&apos;re carrying.</h2>
            <p className="lede">
              Send us the shape of the problem — portfolio size, sector, how old the arrears are.
              We&apos;ll come back within one working day with an honest view of what is recoverable.
            </p>
          </div>
          <div className="aside-card">
            <h3>Start here</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
              No obligation, no cost, and nothing is contacted until you say so.
            </p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
            </div>
            <p className="meta" style={{ marginTop: "1.25rem" }}>
              Or call <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> — {site.hours}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
