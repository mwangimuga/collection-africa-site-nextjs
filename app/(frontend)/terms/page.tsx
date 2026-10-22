import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of service",
  description: "The terms governing your use of the Collection Africa Kenya Limited website.",
  path: "/terms",
});

const UPDATED = "20 September 2026";

export default function TermsPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Terms of service", path: "/terms" }]} />
          <h1>Terms of service</h1>
          <p className="meta">Last updated {UPDATED}</p>
        </div>
      </section>

      <section className="band">
        <div className="shell prose">
          <p className="notice notice--bad">
            Draft for legal review. These terms must be reviewed and approved by{" "}
            {site.legalName}&apos;s advocate before publication.
          </p>

          <h2>1. These terms</h2>
          <p>
            These terms govern your use of {site.url}. By using the site you accept them. They do
            not govern any recovery, training or revenue engagement — those are covered by a
            separate signed agreement, which prevails over anything on this website.
          </p>

          <h2>2. What this website is</h2>
          <p>
            An information resource about our services. Nothing on it is an offer capable of
            acceptance, a quotation, or a guarantee of any recovery rate or outcome. Fees are
            agreed in writing for each engagement.
          </p>

          <h2>3. Not legal or financial advice</h2>
          <p>
            Our articles and service pages describe general practice in Kenya. They are not legal,
            financial or accounting advice and must not be relied on as such. Take your own
            professional advice on your specific circumstances.
          </p>

          <h2>4. Our automated assistant and chat</h2>
          <p>
            The website assistant and live chat give general information drawn from this site.
            Automated responses can be incomplete or wrong, and nothing said by an automated
            assistant binds {site.legalName}. Do not submit debtor details, ID numbers, account
            numbers or other sensitive personal data through chat — use the{" "}
            <Link href="/contact">contact form</Link> or call us.
          </p>

          <h2>5. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the site for any unlawful purpose, or to harass any person.</li>
            <li>Submit false information through any form, or impersonate another person.</li>
            <li>Attempt to gain unauthorised access to the site, its servers or connected systems.</li>
            <li>Scrape, harvest or bulk-extract content without our written permission.</li>
            <li>Use the assistant or chat to attempt to extract personal data about any individual.</li>
          </ul>

          <h2>6. Intellectual property</h2>
          <p>
            All content on this site, including text, layout, graphics and the Collection Africa
            name and marks, belongs to {site.legalName} or its licensors. You may read, print and
            share pages for your own non-commercial use. Republishing or commercial use requires our
            written permission.
          </p>

          <h2>7. Job applications</h2>
          <p>
            We never charge for an application, interview, medical or placement. Anyone requesting
            payment in our name is acting fraudulently. Report it to{" "}
            <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>.
          </p>

          <h2>8. Third-party links</h2>
          <p>
            Links to other websites are provided for convenience. We do not control them and are not
            responsible for their content or their privacy practices.
          </p>

          <h2>9. Availability and liability</h2>
          <p>
            We aim to keep the site available but do not guarantee uninterrupted access. To the
            fullest extent permitted by Kenyan law, we exclude liability for indirect or
            consequential loss arising from your use of, or inability to use, this website. Nothing
            here limits liability that cannot lawfully be limited.
          </p>

          <h2>10. Privacy</h2>
          <p>
            Our <Link href="/privacy">privacy policy</Link> explains how we handle personal data and
            forms part of these terms.
          </p>

          <h2>11. Governing law</h2>
          <p>
            These terms are governed by the laws of Kenya, and the courts of Kenya have exclusive
            jurisdiction over any dispute arising from them.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
