export type Job = {
  slug: string;
  title: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  department: string;
  postedAt: string;
  closesAt?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

/** TODO(client): replace with live vacancies. An empty array renders a clean
 *  "no open roles" state with a speculative-application form, which is fine. */
export const jobs: Job[] = [
  {
    slug: "collections-officer-nairobi",
    title: "Collections officer",
    location: "Nairobi",
    type: "Full-time",
    department: "Operations",
    postedAt: "2026-09-01",
    closesAt: "2026-10-15",
    summary:
      "Work a portfolio of overdue accounts by phone and in writing, reaching arrangements debtors can actually meet and keeping a clean record of every contact.",
    responsibilities: [
      "Contact assigned debtors by call, SMS and letter within agreed service levels",
      "Negotiate and document instalment arrangements",
      "Log every interaction accurately on the same day",
      "Escalate disputes and hardship cases rather than pressing them",
      "Meet monthly recovery and contact-rate targets",
    ],
    requirements: [
      "Diploma or degree in business, finance or a related field",
      "At least two years in collections, credit control or customer service",
      "Fluent English and Kiswahili",
      "Demonstrated composure on difficult calls",
      "Clean certificate of good conduct",
    ],
  },
  {
    slug: "field-revenue-officer",
    title: "Field revenue officer",
    location: "Rotational, county assignments",
    type: "Contract",
    department: "County solutions",
    postedAt: "2026-09-01",
    summary:
      "Enumerate businesses and properties on the ground, capture accurate geo-referenced records, and support ratepayers through the billing process.",
    responsibilities: [
      "Conduct field enumeration against assigned routes",
      "Capture accurate business, property and contact data on mobile",
      "Explain the basis of charges to ratepayers courteously",
      "Report anomalies and suspected leakage to the team lead",
    ],
    requirements: [
      "Certificate or diploma in any field",
      "Comfortable with mobile data capture",
      "Willingness to travel and work outside Nairobi",
      "Local language skills an advantage",
    ],
  },
];

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);
