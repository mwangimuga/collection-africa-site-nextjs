import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getService, getServices } from "@/lib/cms";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { breadcrumbSchema, buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

/** Pre-renders every service page at build time. */
export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Not found" };

  return buildMetadata({
    title: `${service.name} in Kenya`,
    description: `${service.summary} ${service.audience}`.slice(0, 158),
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, services, site] = await Promise.all([getService(slug), getServices(), getCompany()]);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const banner = `/assets/banners/banner-services-${service.slug}.jpg`;
  const hasBanner = assetExists(banner);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: service.summary,
            path: `/services/${service.slug}`,
          }),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs
            trail={[
              { name: "Services", path: "/services" },
              { name: service.name, path: `/services/${service.slug}` },
            ]}
          />
          <h1>{service.name}</h1>
          <p className="lede">{service.summary}</p>
        </div>
      </section>

      <section className="band">
        <div className="shell split">
          <div className="prose">
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}

            <h2>What this covers</h2>
            <div className="ledger">
              {service.capabilities.map((c) => (
                <div className="ledger-row" key={c.title}>
                  <p className="ledger-row__name">{c.title}</p>
                  <p className="ledger-row__note">{c.body}</p>
                </div>
              ))}
            </div>

            <h2>How it works</h2>
            <div className="steps">
              {service.process.map((step) => (
                <div className="step" key={step.title}>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2>Questions we get asked</h2>
            <div className="faq">
              {service.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="aside-card">
            <h3>Who this is for</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{service.audience}</p>

            <h4 style={{ marginTop: "1.75rem" }}>What you get</h4>
            <ul className="marks" style={{ fontSize: "0.92rem" }}>
              {service.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>

            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
            </div>
            <p className="meta" style={{ marginTop: "1rem" }}>
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            </p>
          </aside>
        </div>
      </section>

      <section className="band band--paper band--tight">
        <div className="shell">
          <div className="section-head">
            <h2>Start a conversation about {service.name.toLowerCase()}</h2>
            <p className="lede">
              Tell us the shape of the problem. We&apos;ll reply within one working day.
            </p>
          </div>
          <div style={{ maxWidth: "46rem" }}>
            <ContactForm services={services} defaultService={service.name} />
          </div>
        </div>
      </section>

      <section className="band band--tight">
        <div className="shell">
          <h2 style={{ fontSize: "var(--step-2)" }}>Other practices</h2>
          <div className="ledger">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="ledger-row">
                <p className="ledger-row__name">{s.name}</p>
                <span className="ledger-row__value">View</span>
                <p className="ledger-row__note">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
