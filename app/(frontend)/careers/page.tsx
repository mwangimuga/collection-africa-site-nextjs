import { getCompany, getJobs } from "@/lib/cms";
import { ApplicationForm } from "@/components/application-form";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, buildMetadata, jobSchema } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "Open roles at Collection Africa Kenya Limited. Collections, field revenue and support positions across Kenya.",
  path: "/careers",
  keywords: ["jobs Collection Africa", "collections officer jobs Kenya", "debt collection careers Nairobi"],
});

export default async function CareersPage() {
  const [jobs, site] = await Promise.all([getJobs(), getCompany()]);
  const roles = [...jobs.map((j) => j.title), "Speculative application"];
  const banner = "/assets/banners/banner-careers.jpg";
  const hasBanner = assetExists(banner);
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Careers", path: "/careers" }]), ...jobs.map(jobSchema)]} />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Careers", path: "/careers" }]} />
          <h1>Work here.</h1>
          <p className="lede">
            This is difficult work done properly. If you can stay composed in a hard conversation
            and write down exactly what happened, we should talk.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell">
          <h2 style={{ fontSize: "var(--step-2)" }}>Open roles</h2>

          {jobs.length === 0 ? (
            <p className="lede">
              Nothing open right now. Send a speculative application below and we&apos;ll keep it
              on file for six months.
            </p>
          ) : (
            <div className="grid grid--2" style={{ marginTop: "1.5rem" }}>
              {jobs.map((job) => (
                <article className="panel" id={job.slug} key={job.slug}>
                  <h3>{job.title}</h3>
                  <p className="meta">
                    {job.type} · {job.location} · {job.department}
                    {job.closesAt && (
                      <> · closes {new Date(job.closesAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>
                    )}
                  </p>
                  <p style={{ marginTop: "0.75rem" }}>{job.summary}</p>

                  <h4 style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>What you&apos;d do</h4>
                  <ul className="marks" style={{ fontSize: "0.92rem" }}>
                    {job.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>

                  <h4 style={{ marginTop: "1.25rem", fontSize: "0.95rem" }}>What you need</h4>
                  <ul className="marks" style={{ fontSize: "0.92rem" }}>
                    {job.requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="band band--paper">
        <div className="shell split">
          <div>
            <h2>Apply</h2>
            <p className="lede">
              One form for every role. Attach your CV and tell us which position you want.
            </p>
            <p className="notice notice--bad" style={{ maxWidth: "40ch", marginTop: "1.5rem" }}>
              We never charge applicants a fee, at any stage. If someone asks you to pay for
              an interview, a medical or a placement in our name, it is a scam — report it to{" "}
              <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>.
            </p>
          </div>
          <div>
            <ApplicationForm roles={roles} />
          </div>
        </div>
      </section>
    </>
  );
}
