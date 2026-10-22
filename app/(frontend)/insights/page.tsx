import Link from "next/link";
import { getPosts } from "@/lib/cms";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

export const metadata = buildMetadata({
  title: "Insights",
  description:
    "Practical writing on debt recovery, county revenue and credit management in Kenya, from the team that does the work.",
  path: "/insights",
  keywords: ["debt recovery insights Kenya", "credit management articles", "county revenue analysis"],
});

export default async function InsightsPage() {
  const posts = await getPosts();
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const banner = "/assets/banners/banner-insights.jpg";
  const hasBanner = assetExists(banner);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Insights", path: "/insights" }])} />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Insights", path: "/insights" }]} />
          <h1>Insights</h1>
          <p className="lede">
            What we have learned recovering debt and revenue in Kenya. No thought leadership,
            no predictions — just what works and what does not.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          {sorted.length === 0 ? (
            <p className="lede">Nothing published yet. Check back shortly.</p>
          ) : (
            <div className="ledger">
              {sorted.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} className="ledger-row">
                  <p className="ledger-row__name">{p.title}</p>
                  <span className="ledger-row__value">{p.readingMinutes} min</span>
                  <p className="ledger-row__note">
                    <span className="tag">{p.category}</span>{" "}
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
