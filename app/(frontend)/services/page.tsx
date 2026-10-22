import Link from "next/link";
import { getServices } from "@/lib/cms";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { assetExists } from "@/lib/assets";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Debt collection, county revenue maximisation, bulk SMS, credit management training and skip tracing — delivered across Kenya by Collection Africa.",
  path: "/services",
  keywords: ["debt collection services Kenya", "revenue collection services", "credit services Kenya"],
});

export default async function ServicesPage() {
  const services = await getServices();
  const banner = "/assets/banners/banner-services.jpg";
  const hasBanner = assetExists(banner);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Services", path: "/services" }]} />
          <h1>Five practices, one standard of conduct.</h1>
          <p className="lede">
            Each of these grew out of a problem a Kenyan client actually brought us.
            They share the same compliance framework and the same reporting discipline.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <div className="ledger">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="ledger-row">
                <p className="ledger-row__name">{s.name}</p>
                <span className="ledger-row__value">Details</span>
                <p className="ledger-row__note">
                  {s.summary} <span style={{ color: "var(--rule-strong)" }}>—</span> {s.audience}
                </p>
              </Link>
            ))}
          </div>

          <div className="btn-row">
            <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
