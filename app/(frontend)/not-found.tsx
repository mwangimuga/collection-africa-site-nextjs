import Link from "next/link";
import { getServices } from "@/lib/cms";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default async function NotFound() {
  const services = await getServices();
  return (
    <section className="band">
      <div className="shell">
        <h1>That page isn&apos;t here</h1>
        <p className="lede">
          The link may be out of date, or the page may have moved during our site rebuild.
          Here is where most people were heading.
        </p>
        <div className="ledger" style={{ marginTop: "2.5rem", maxWidth: "48rem" }}>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="ledger-row">
              <p className="ledger-row__name">{s.name}</p>
              <span className="ledger-row__value">View</span>
              <p className="ledger-row__note">{s.summary}</p>
            </Link>
          ))}
        </div>
        <div className="btn-row">
          <Link href="/" className="btn btn--primary">Back to the home page</Link>
          <Link href="/contact" className="btn btn--outline">Contact the team</Link>
        </div>
      </div>
    </section>
  );
}
