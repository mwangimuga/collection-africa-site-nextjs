export type Service = {
  slug: string;
  name: string;
  /** Short line used in nav, cards and the ledger on the home page. */
  summary: string;
  /** Who this is actually for — shown on the service page. */
  audience: string;
  /** Long-form intro, 2 paragraphs. */
  intro: string[];
  /** Ordered stages. These are a real sequence, so they are numbered. */
  process: { title: string; body: string }[];
  /** Unordered capabilities. Deliberately not numbered. */
  capabilities: { title: string; body: string }[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  /** Primary SEO keyword cluster for this page. */
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "debt-collection",
    name: "Debt collection",
    summary: "Amicable recovery of performing and non-performing accounts.",
    audience: "Banks, SACCOs, microfinance, insurers, hospitals, schools, landlords and corporates carrying overdue receivables.",
    intro: [
      "Most overdue accounts are not fraud. They are cash-flow problems, disputes or people who stopped opening letters. We treat them that way. Our collectors open a conversation, establish what the debtor can actually pay, and put a written arrangement in place that both sides can live with.",
      "Where a matter genuinely cannot be settled amicably, we hand you a clean, documented file — contact history, promises made, payments received and asset information — so your legal team starts from evidence rather than guesswork.",
    ],
    process: [
      { title: "Portfolio handover", body: "You send the accounts through a secure transfer. We validate balances, flag duplicates and confirm what is legally collectable before anyone is contacted." },
      { title: "Trace and verify", body: "Unreachable debtors go through address and employment verification so that contact is made with the right person." },
      { title: "First contact", body: "A named collector makes contact by call, SMS or letter, explains the balance, and listens. Every interaction is logged." },
      { title: "Arrangement", body: "We agree a lump sum or an instalment plan in writing, with dates and amounts the debtor has confirmed they can meet." },
      { title: "Monitoring and remittance", body: "Payments are monitored, broken arrangements are re-engaged, and funds are remitted to you on an agreed cycle with a reconciliation statement." },
      { title: "Escalation or closure", body: "Accounts that resist resolution are returned with a full evidence file and a recommendation. Settled accounts are closed and confirmed to the debtor in writing." },
    ],
    capabilities: [
      { title: "Early-stage arrears", body: "Light-touch reminders on accounts 1–90 days overdue, before a relationship is damaged." },
      { title: "Non-performing loan books", body: "Structured campaigns on aged books, including bulk portfolios bought or inherited." },
      { title: "Field collection", body: "In-person visits by identified officers where a debtor cannot be reached remotely." },
      { title: "Debtor dispute handling", body: "Disputed balances are paused, referred back to you with the debtor's account of events, and resolved before collection resumes." },
      { title: "Reconciliation and reporting", body: "Portfolio-level reporting on contact rates, promise-to-pay conversion, recovery value and ageing movement." },
    ],
    outcomes: [
      "A written arrangement on accounts that were previously silent",
      "Cash recovered without the cost and delay of litigation",
      "A defensible audit trail for every account touched",
      "Customers who can be sold to again",
    ],
    faqs: [
      { q: "Do you charge upfront?", a: "Our standard debt collection engagement is commission-based on amounts actually recovered. Fixed-fee and hybrid arrangements are available for large or specialised portfolios. Fees are agreed in writing before any account is worked." },
      { q: "How do you treat debtors?", a: "Under our Ethical Recovery Charter. No threats, no impersonation of police or court officers, no contact outside permitted hours, no disclosure of a debt to third parties, and no harassment. Any breach is a disciplinary matter." },
      { q: "Is our customer data safe?", a: "Data is transferred over encrypted channels, held only for the duration of the engagement plus any agreed retention period, and processed under Kenya's Data Protection Act, 2019. We sign a data processing agreement as your processor." },
      { q: "What size portfolio do you take on?", a: "We work single high-value accounts and books of tens of thousands of accounts. The approach changes; the standards do not." },
    ],
    keywords: ["debt collection Kenya", "debt recovery agency Nairobi", "non-performing loan recovery", "receivables collection Kenya"],
  },
  {
    slug: "county-revenue-maximisation",
    name: "County revenue maximisation",
    summary: "Finding, billing and collecting revenue counties are already owed.",
    audience: "County governments, county revenue boards, water and sanitation companies, and public agencies with own-source revenue targets.",
    intro: [
      "Counties rarely have a rate problem. They have a register problem. Businesses trading without a permit, properties never valued, market stalls collected in cash, and arrears nobody has followed up. The revenue is already legislated — it is simply not reaching the county account.",
      "We work alongside county finance teams to rebuild the register, digitise billing, and collect arrears through the same ethical process we apply to any other debtor. Ratepayers get a clear bill and a way to pay it; the county gets a revenue line it can forecast.",
    ],
    process: [
      { title: "Baseline and gap analysis", body: "We reconcile the current register against field reality and historic collections to size the gap by revenue stream." },
      { title: "Register rebuild", body: "Field enumeration of businesses, properties, stalls and signage, geo-referenced and matched to existing records." },
      { title: "Billing and notification", body: "Ratepayers are billed and notified by SMS and letter, with the basis of the charge stated plainly." },
      { title: "Arrears collection", body: "Aged balances are worked through structured engagement and instalment arrangements, not enforcement first." },
      { title: "Handover and capability transfer", body: "County staff are trained on the register and reporting so the gains survive the engagement." },
    ],
    capabilities: [
      { title: "Single business permit", body: "Enumeration, classification review, billing and renewal follow-up." },
      { title: "Property rates", body: "Register cleanup, arrears profiling and structured recovery." },
      { title: "Market and parking revenue", body: "Moving cash-handled streams onto traceable digital collection." },
      { title: "Revenue dashboards", body: "Daily collection visibility by stream, sub-county and officer." },
      { title: "Leakage investigation", body: "Reconciliation of receipts to banked revenue, with findings reported to the accounting officer." },
    ],
    outcomes: [
      "A register that matches what is actually on the ground",
      "Own-source revenue that can be forecast and budgeted against",
      "Cash streams moved off manual receipting",
      "County staff who can run the system without us",
    ],
    faqs: [
      { q: "How are you procured?", a: "Through the county's normal procurement process under the Public Procurement and Asset Disposal Act. We respond to tenders and expressions of interest and can support pre-qualification." },
      { q: "Do you take over county revenue collection?", a: "No. Revenue is collected into county accounts. We build the register, run the billing and engagement, and report. Custody of funds stays with the county." },
      { q: "How long before a county sees movement?", a: "Enumeration and register work typically shows billable movement within a quarter. Arrears recovery follows once bills are issued and disputed items are cleared." },
    ],
    keywords: ["county revenue collection Kenya", "own source revenue", "single business permit enumeration", "property rates arrears Kenya"],
  },
  {
    slug: "bulk-sms-communication",
    name: "Bulk SMS communication",
    summary: "Reminders, statements and notices that reach people who ignore email.",
    audience: "Lenders, schools, SACCOs, utilities, counties and any organisation that needs a message to actually arrive.",
    intro: [
      "SMS is still the only channel with near-universal reach in Kenya, and the only one people read within minutes. Used well, a reminder sent three days before a due date prevents the arrears that cost you ten times more to recover.",
      "We provide the sender ID, the delivery infrastructure and the message design — including the discipline of writing a reminder that prompts payment without reading as a threat.",
    ],
    process: [
      { title: "Sender ID registration", body: "We register your alphanumeric sender ID with the networks so messages arrive branded rather than from a shortcode." },
      { title: "List preparation", body: "Numbers are validated and normalised, opt-outs are honoured, and duplicates are removed before a campaign runs." },
      { title: "Message design", body: "Copy is written for clarity and compliance, with the amount, due date and payment route in the first line." },
      { title: "Scheduled delivery", body: "Campaigns run on a schedule tied to due dates, within permitted contact hours." },
      { title: "Delivery reporting", body: "Per-message delivery status, failure reasons and response rates, exportable for reconciliation." },
    ],
    capabilities: [
      { title: "Payment reminders", body: "Pre-due, due-date and arrears sequences triggered off your billing cycle." },
      { title: "Two-way messaging", body: "Replies routed to a queue your team can answer." },
      { title: "Bulk notices", body: "Service interruptions, deadline changes, AGM notices and public announcements." },
      { title: "API integration", body: "Trigger messages directly from your core banking, billing or ERP system." },
      { title: "Opt-out management", body: "Automatic suppression lists so a person who opts out stays opted out." },
    ],
    outcomes: [
      "Fewer accounts falling into arrears in the first place",
      "Messages that arrive from your name, not an anonymous number",
      "A delivery record you can point to in a dispute",
    ],
    faqs: [
      { q: "How long does sender ID registration take?", a: "Typically five to ten working days across the major networks, depending on documentation. We handle the submissions." },
      { q: "Is bulk SMS marketing regulated?", a: "Yes. Unsolicited commercial messages are restricted under the Data Protection Act and Communications Authority rules. Transactional messages to your own customers about their own account are on much firmer ground than marketing blasts. We advise on which is which." },
      { q: "Can you send in Kiswahili?", a: "Yes, and we recommend it for consumer portfolios. Mixed-language sequences generally outperform English-only." },
    ],
    keywords: ["bulk SMS Kenya", "payment reminder SMS", "sender ID registration Kenya", "SMS API Kenya"],
  },
  {
    slug: "credit-management-training",
    name: "Credit management training",
    summary: "Practical workshops for the people who approve and chase credit.",
    audience: "Credit controllers, relationship managers, branch teams, finance officers and boards setting credit policy.",
    intro: [
      "Recovery is expensive. Most of what we recover could have been prevented at origination by a better question, a verified document or a credit limit set on evidence rather than optimism.",
      "Our workshops are built from live Kenyan case files, not textbook scenarios. Participants work real portfolios, write real demand letters, and leave with a credit policy draft their organisation can actually adopt.",
    ],
    process: [
      { title: "Needs assessment", body: "We review your arrears profile and write-off history to find where credit is actually failing." },
      { title: "Tailored curriculum", body: "Modules are selected and weighted against those findings rather than delivered off the shelf." },
      { title: "Delivery", body: "In-person or virtual, in half-day or multi-day formats, with exercises on your own anonymised data." },
      { title: "Assessment and certification", body: "Participants are assessed and certified, with results shared with the sponsor." },
      { title: "Follow-up review", body: "A review session at 90 days to check what changed in practice." },
    ],
    capabilities: [
      { title: "Credit risk evaluation", body: "Assessing capacity, character and collateral in a Kenyan SME and consumer context." },
      { title: "Collections conversations", body: "Structured negotiation, objection handling and de-escalation on live calls." },
      { title: "Credit policy design", body: "Writing limits, approval authority, provisioning triggers and write-off rules that hold up." },
      { title: "Legal and regulatory framework", body: "Data Protection Act obligations, limitation periods, and what a collector may and may not do." },
      { title: "Portfolio analytics", body: "Reading ageing, roll rates and vintage curves well enough to act early." },
    ],
    outcomes: [
      "Credit decisions made against written criteria",
      "Collectors who can hold a difficult conversation without escalating it",
      "A credit policy document the board can approve",
    ],
    faqs: [
      { q: "Where is training delivered?", a: "At your premises, at a venue we arrange, or virtually. Regional and residential formats are available for multi-branch teams." },
      { q: "What group size works best?", a: "Twelve to twenty-five. Smaller groups get more call practice; larger groups work better for policy and awareness sessions." },
      { q: "Is the certification recognised?", a: "Certificates are issued by Collection Africa and are widely accepted internally for CPD purposes. Where you need accreditation from a specific professional body, tell us at scoping and we will map the curriculum to it." },
    ],
    keywords: ["credit management training Kenya", "credit control course Nairobi", "collections training", "credit risk workshop Kenya"],
  },
  {
    slug: "skip-tracing-and-investigation",
    name: "Skip tracing and investigation",
    summary: "Locating people, assets and documents — lawfully and on the record.",
    audience: "Lenders, insurers, law firms and corporates who need to find a party, verify an asset or check a claim.",
    intro: [
      "A debtor who cannot be found is not a debtor you can negotiate with. Skip tracing closes that gap: confirming current address, employment, contact details and whether there is anything worth pursuing before you spend money on enforcement.",
      "Everything we do here sits inside the law. We use lawful sources, licensed investigators and documented methods, and we will tell you plainly when a line of enquiry cannot be pursued legally.",
    ],
    process: [
      { title: "Instruction and scope", body: "You define the question. We confirm in writing what can lawfully be established and what it will take." },
      { title: "Desk research", body: "Public registries, lawful databases and existing file material are reviewed first." },
      { title: "Field verification", body: "Licensed investigators confirm findings on the ground and photograph what is relevant." },
      { title: "Report", body: "A written report with sources, dates, confidence levels and supporting exhibits." },
    ],
    capabilities: [
      { title: "Address and contact tracing", body: "Locating parties who have moved or gone quiet." },
      { title: "Employment verification", body: "Confirming employer and income for arrangement or attachment purposes." },
      { title: "Asset location", body: "Identifying property, vehicles and business interests through lawful registry searches." },
      { title: "Pre-employment background checks", body: "Identity, qualification and reference verification for hiring decisions." },
      { title: "Insurance claim verification", body: "Independent verification of the circumstances behind a claim." },
    ],
    outcomes: [
      "A current, verified address for a party you had lost",
      "An evidence-based decision on whether enforcement is worth the cost",
      "A report that stands up when it is put in front of a court or a board",
    ],
    faqs: [
      { q: "Is skip tracing legal in Kenya?", a: "Yes, when it relies on lawful sources and licensed investigators, and when personal data is processed under the Data Protection Act, 2019 with a lawful basis. We do not access data we are not entitled to access, and we decline instructions that would require it." },
      { q: "Can you find bank account details?", a: "No. Bank records are obtainable only through a court order or a lawful regulatory process. Anyone offering you account balances informally is breaking the law and will taint your case." },
      { q: "Will the subject know they were traced?", a: "Desk research is discreet. Field verification may involve contact with neighbours or employers, which carries a risk of disclosure. We will tell you which approach we are taking before we take it." },
    ],
    keywords: ["skip tracing Kenya", "private investigator Nairobi", "asset tracing Kenya", "background check Kenya"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
