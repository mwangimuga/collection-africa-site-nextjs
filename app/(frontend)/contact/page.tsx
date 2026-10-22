import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCompany, getServices } from "@/lib/cms";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Talk to Collection Africa about debt recovery, county revenue, bulk SMS, credit training or investigations. Offices in Nairobi, Kisumu and Nakuru.",
  path: "/contact",
  keywords: ["contact Collection Africa", "debt collection agency contact Kenya"],
});

export default async function ContactPage() {
  const [site, services] = await Promise.all([getCompany(), getServices()]);
  const offices = site.offices;
  const banner = "/assets/banners/banner-contact.jpg";
  const hasBanner = assetExists(banner);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
          <h1>Tell us what you&apos;re carrying.</h1>
          <p className="lede">
            Portfolio size, sector, how old the arrears are — whatever you have.
            We reply within one working day.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell split">
          <div>
            <ContactForm services={services} />
          </div>

          <aside>
            <div className="aside-card">
              <h3>Direct lines</h3>
              <div className="ledger">
                <div className="ledger-row">
                  <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Enquiries</p>
                  <span className="ledger-row__value">
                    <a href={`mailto:${site.email}`}>Email</a>
                  </span>
                  <p className="ledger-row__note">{site.email}</p>
                </div>
                <div className="ledger-row">
                  <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Phone</p>
                  <span className="ledger-row__value">
                    <a href={`tel:${site.phone}`}>Call</a>
                  </span>
                  <p className="ledger-row__note">{site.phoneDisplay} · {site.hours}</p>
                </div>
                <div className="ledger-row">
                  <p className="ledger-row__name" style={{ fontSize: "1rem" }}>Careers</p>
                  <span className="ledger-row__value">
                    <a href={`mailto:${site.careersEmail}`}>Email</a>
                  </span>
                  <p className="ledger-row__note">{site.careersEmail}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "var(--step-1)" }}>Offices</h3>
              <div className="ledger">
                {offices.map((o) => (
                  <div className="ledger-row" key={o.city}>
                    <p className="ledger-row__name" style={{ fontSize: "1rem" }}>{o.city}</p>
                    <span className="ledger-row__value">{o.label}</span>
                    <p className="ledger-row__note">{o.street}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="meta" style={{ marginTop: "1.5rem", maxWidth: "36ch" }}>
              If you are a debtor asking about your own account, please call rather than
              using this form so we can verify your identity.
            </p>

            <div className="aside-card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "var(--step-1)" }}>Reporting misconduct</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                If a collector acting in our name has threatened you, disclosed your debt to
                someone else, or asked for payment into a personal account, report it. Write to{" "}
                <a href="mailto:ethics@collectionafrica.co.ke">ethics@collectionafrica.co.ke</a>,
                which reaches compliance rather than the collections floor.
              </p>
              <p className="meta" style={{ marginTop: "0.75rem" }}>
                We acknowledge within two working days and pause collection on the account while
                we investigate. See the <Link href="/ethics">Ethical Recovery Charter</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
