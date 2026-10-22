import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ethical Recovery Charter",
  description:
    "The conduct standard every Collection Africa collector works to: what we will do, what we will never do, and how to complain if we get it wrong.",
  path: "/ethics",
  keywords: ["ethical debt collection Kenya", "debt collector conduct", "debt collection complaint Kenya"],
});

export default function EthicsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Ethical Recovery Charter", path: "/ethics" }])} />

      <section className="page-head">
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Ethical Recovery Charter", path: "/ethics" }]} />
          <h1>Ethical Recovery Charter</h1>
          <p className="lede">
            This is the standard every Collection Africa collector works to. It is not
            aspirational language — breaches are disciplinary matters.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell prose">
          <h2>What we will always do</h2>
          <ul>
            <li>Identify ourselves by name, and identify Collection Africa and the creditor we act for.</li>
            <li>State the balance, what it relates to, and how it was calculated, in writing on request.</li>
            <li>Listen to the debtor&apos;s circumstances before proposing an arrangement.</li>
            <li>Put every agreed arrangement in writing, with dates and amounts.</li>
            <li>Pause collection on an account where a genuine dispute is raised, until it is resolved.</li>
            <li>Log every contact accurately on the day it happens.</li>
            <li>Confirm settlement in writing once an account is cleared.</li>
          </ul>

          <h2>What we will never do</h2>
          <ul>
            <li>Threaten arrest or criminal prosecution over a civil debt.</li>
            <li>Present ourselves as police, court officials or auctioneers.</li>
            <li>Disclose a debt to an employer, family member, neighbour or any third party.</li>
            <li>Use abusive language, threats, intimidation or any form of violence.</li>
            <li>Contact a debtor outside reasonable hours, or with a volume of contact amounting to harassment.</li>
            <li>Seize or threaten to seize property without a court order executed by a licensed auctioneer.</li>
            <li>Misstate a balance, add unauthorised charges, or collect on a debt we know to be disputed or time-barred.</li>
            <li>Ask for payment into a personal account. All payments go to the creditor&apos;s or Collection Africa&apos;s official accounts.</li>
          </ul>

          <blockquote>
            <p>
              If a collector has to break a rule to recover an account, the account was not
              going to be recovered lawfully in the first place.
            </p>
          </blockquote>

          <h2>How we handle your data</h2>
          <p>
            We act as a data processor on behalf of the creditor who instructs us, under the Data
            Protection Act, 2019. We process only the data needed to recover the account, hold it
            only for as long as the engagement and any agreed retention period require, and never
            sell or share it for marketing. Full detail is in our{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2>If we get it wrong</h2>
          <p>
            Tell us. Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> with the account reference and
            what happened. We will acknowledge within two working days, pause collection on the
            account while we investigate, and give you a written outcome.
          </p>
          <p>
            If you are not satisfied with our response, you may complain to the creditor directly,
            or to the Office of the Data Protection Commissioner where the matter concerns your
            personal data.
          </p>

          <h2>Vulnerability</h2>
          <p>
            Where a debtor discloses serious illness, bereavement, disability or another
            circumstance that materially affects their ability to engage, the account is flagged,
            routine collection activity stops, and the matter is referred back to the creditor with
            a recommendation. We do not press vulnerable debtors.
          </p>
        </div>
      </section>
    </>
  );
}
