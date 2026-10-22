import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How Collection Africa Kenya Limited collects, uses, shares and protects personal data under the Data Protection Act, 2019.",
  path: "/privacy",
});

const UPDATED = "20 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Privacy policy", path: "/privacy" }]} />
          <h1>Privacy policy</h1>
          <p className="meta">Last updated {UPDATED}</p>
        </div>
      </section>

      <section className="band">
        <div className="shell prose">
          <p className="notice notice--bad">
            Draft for legal review. This policy was prepared as a working draft and must be
            reviewed and approved by {site.legalName}&apos;s advocate before publication.
          </p>

          <h2>Who we are</h2>
          <p>
            {site.legalName} is registered in Kenya and operates from {""}
            7th Floor, Rhapta Heights, Rhapta Road, Westlands, Nairobi. For privacy questions,
            contact <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Our two roles</h2>
          <p>
            We act as a <strong>data controller</strong> for data you give us directly — website
            enquiries, job applications, and business contacts. We act as a{" "}
            <strong>data processor</strong> for debtor data supplied by a client who has instructed
            us to recover an account. In that case the client is the controller and determines why
            and how the data is used; we process it under a written data processing agreement.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Enquiry data:</strong> name, email, phone, organisation and the content of your message.</li>
            <li><strong>Application data:</strong> name, contact details, CV and anything else you send in support.</li>
            <li><strong>Debtor data (as processor):</strong> identity, contact, account and payment information supplied by our client, plus contact records we create.</li>
            <li><strong>Technical data:</strong> IP address, device and browser information, and pages visited, collected through analytics and used for security and rate limiting.</li>
            <li><strong>Chat data:</strong> messages you send to our website chat or assistant.</li>
          </ul>

          <h2>Why we use it, and our lawful basis</h2>
          <ul>
            <li>To answer your enquiry — on the basis of your consent and our legitimate interest in responding.</li>
            <li>To assess a job application — on the basis of steps taken before entering a contract.</li>
            <li>To recover debts on behalf of a client — on the basis of that client&apos;s lawful basis, usually the performance of a contract or their legitimate interest.</li>
            <li>To keep the site secure and functioning — on the basis of our legitimate interest.</li>
            <li>To meet legal, tax and regulatory obligations.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            We share personal data only with the client who instructed us, our vetted service
            providers (email delivery, hosting, live chat and AI processing), and regulators, courts
            or law enforcement where we are legally required to. We do not sell personal data.
          </p>

          <h3>Third-party processors used by this website</h3>
          <ul>
            <li><strong>Tawk.to</strong> — live chat. Messages and basic technical data are processed on their infrastructure.</li>
            <li><strong>Anthropic</strong> — powers the on-site assistant and AI search. Your typed questions are sent to the Anthropic API to generate a response.</li>
            <li><strong>Google</strong> — analytics and tag management, where enabled.</li>
            <li><strong>Our email provider</strong> — delivery of form submissions to our team.</li>
          </ul>

          <h2>Transfers outside Kenya</h2>
          <p>
            Some of these providers process data outside Kenya. Where that happens we rely on the
            safeguards permitted under sections 48 and 49 of the Data Protection Act, 2019,
            including contractual protections with each provider.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li>Website enquiries: 24 months from your last contact with us.</li>
            <li>Unsuccessful job applications: 6 months, unless you ask us to keep them longer.</li>
            <li>Debtor data held as processor: for the engagement plus the retention period agreed with the client.</li>
            <li>Financial records: 7 years, as required by Kenyan tax law.</li>
          </ul>

          <h2>Your rights</h2>
          <p>
            Under the Data Protection Act, 2019 you may request access to your data, ask us to
            correct or delete it, object to processing, request that processing be restricted, and
            ask for a copy in a portable format. Where we hold your data as a processor for a
            creditor, we will forward your request to that creditor and support them in responding.
          </p>
          <p>
            To exercise any of these, email <a href={`mailto:${site.email}`}>{site.email}</a>. We
            respond within the statutory timeframe. You also have the right to lodge a complaint
            with the Office of the Data Protection Commissioner.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies that are necessary for the site to work, and — where you allow them —
            analytics cookies that tell us which pages are useful. Our live chat provider sets its
            own cookies to maintain your conversation. You can block cookies in your browser,
            though parts of the site may stop working.
          </p>

          <h2>Security</h2>
          <p>
            Data is transmitted over TLS, access is restricted to staff who need it, and staff are
            trained on data protection. No system is perfectly secure; if a breach affects your
            data and poses a real risk to you, we will notify you and the Commissioner as the Act
            requires.
          </p>

          <h2>Changes</h2>
          <p>
            We update this policy when our practices change. The date at the top reflects the
            current version. Material changes will be flagged on the site.
          </p>

          <p>
            See also our <Link href="/terms">terms of service</Link> and{" "}
            <Link href="/ethics">Ethical Recovery Charter</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
