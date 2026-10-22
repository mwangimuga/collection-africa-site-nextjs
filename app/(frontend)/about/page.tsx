import Link from "next/link";
import { milestones } from "@/content/team";
import { getCompany, getTeam } from "@/lib/cms";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Collection Africa Kenya Limited has recovered debt and revenue for Kenyan institutions since 2001, with offices in Nairobi, Kisumu and Nakuru.",
  path: "/about",
  keywords: ["Collection Africa Kenya", "debt collection company Nairobi", "about Collection Africa"],
});

export default async function AboutPage() {
  const [leadership, site] = await Promise.all([getTeam(), getCompany()]);
  const offices = site.offices;
  const banner = "/assets/banners/banner-about.jpg";
  const hasBanner = assetExists(banner);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
          <h1>We have been doing this since {site.founded}.</h1>
          <p className="lede">
            Collection Africa was built on a simple position: a debtor is a customer who
            has run into trouble. Two decades of recovery data have not given us a reason
            to change it.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell split">
          <div className="prose">
            <h2>What we actually do</h2>
            <p>
              We work overdue accounts on behalf of banks, SACCOs, insurers, schools, landlords,
              corporates and county governments. That means calling people who have stopped
              answering, establishing what they can genuinely pay, and putting an arrangement in
              writing that survives contact with reality.
            </p>
            <p>
              Alongside recovery, we rebuild county revenue registers, run bulk SMS infrastructure,
              train credit teams and carry out lawful skip tracing and investigation. The common
              thread is the same: find the facts, then act on them.
            </p>

            <h2>Why the conduct standard matters commercially</h2>
            <p>
              A collector who threatens people does not recover more money. They generate disputes,
              complaints to the Office of the Data Protection Commissioner, and accounts that become
              unrecoverable because the debtor now has a grievance instead of a balance. Our Ethical
              Recovery Charter exists because it produces better numbers, not only because it is right.
            </p>
            <p>
              <Link href="/ethics">Read the Ethical Recovery Charter</Link>.
            </p>

            <h2>How we are governed</h2>
            <p>
              We act as a data processor for our clients under the Data Protection Act, 2019, working
              to a written data processing agreement. Collector conduct is monitored through call
              review and complaint tracking, and breaches are treated as disciplinary matters.
              Client funds are remitted on an agreed cycle with a reconciliation statement.
            </p>
          </div>

          <aside className="aside-card">
            <h3>At a glance</h3>
            <div className="ledger">
              <div className="ledger-row">
                <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Founded</p>
                <span className="ledger-row__value">{site.founded}</span>
              </div>
              <div className="ledger-row">
                <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Offices</p>
                <span className="ledger-row__value">{offices.length}</span>
              </div>
              <div className="ledger-row">
                <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Practices</p>
                <span className="ledger-row__value">5</span>
              </div>
              <div className="ledger-row">
                <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Languages</p>
                <span className="ledger-row__value">English, Kiswahili</span>
              </div>
            </div>
            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="band band--paper">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">Where we are</span>
            <h2>Three offices, field teams across the counties.</h2>
          </div>
          <div className="grid grid--3">
            {offices.map((o) => (
              <div className="panel" key={o.city}>
                <h3>{o.city}</h3>
                <p>
                  {o.label}
                  <br />
                  {o.street}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">How we got here</span>
            <h2>Milestones.</h2>
          </div>
          <div className="ledger" style={{ maxWidth: "52rem" }}>
            {milestones.map((m) => (
              <div className="ledger-row" key={m.year}>
                <p className="ledger-row__name">{m.event}</p>
                <span className="ledger-row__value">{m.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--paper band--tight">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">Leadership</span>
            <h2>The people accountable for the work.</h2>
          </div>
          <div className="grid grid--2">
            {leadership.map((m) => (
              <div className="panel" key={m.role}>
                <h3>{m.name}</h3>
                <p className="meta">{m.role}</p>
                <p style={{ marginTop: "0.6rem" }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
