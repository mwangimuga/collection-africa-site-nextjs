export type Post = {
  slug: string;
  title: string;
  description: string;
  category: "Debt recovery" | "County revenue" | "Credit management" | "Compliance";
  date: string; // ISO
  author: string;
  readingMinutes: number;
  /** Body as an array of blocks. Keeps rendering dependency-free. */
  body: Block[];
  keywords: string[];
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

/**
 * TODO(client): these three are written as launch content so the section is not
 * empty on day one. Replace or extend with your own material — see
 * docs/user-guide.md, "Publishing an insight".
 */
export const posts: Post[] = [
  {
    slug: "what-a-debt-collector-may-not-do-in-kenya",
    title: "What a debt collector may not legally do in Kenya",
    description:
      "Threats, impersonation, shaming a debtor to their employer — the common tactics that are unlawful in Kenya, and what a compliant collection process looks like instead.",
    category: "Compliance",
    date: "2026-08-18",
    author: "Collection Africa",
    readingMinutes: 6,
    keywords: ["debt collection laws Kenya", "debt collector harassment Kenya", "Data Protection Act debt"],
    body: [
      { type: "p", text: "Debt collection in Kenya is not a lawless space, and the belief that it is costs creditors money. When a collector crosses a line, the debt does not become easier to recover — it becomes contested, the creditor's name ends up in a complaint, and a recoverable balance turns into a liability." },
      { type: "h2", text: "The lines that are not negotiable" },
      { type: "p", text: "Some conduct is prohibited outright, whether or not the debt is genuinely owed." },
      { type: "ul", items: [
        "Threatening arrest or criminal prosecution for a civil debt. Non-payment of a commercial debt is not a criminal offence in Kenya.",
        "Presenting yourself as a police officer, court official or auctioneer when you are not one.",
        "Disclosing the debt to an employer, family member, neighbour or WhatsApp group. This is a Data Protection Act breach regardless of intent.",
        "Threatening or using violence, or damaging property.",
        "Contacting a debtor at unreasonable hours or with a volume of calls that amounts to harassment.",
        "Seizing property without a court order and a licensed auctioneer acting on it.",
      ]},
      { type: "h2", text: "The Data Protection Act changed the economics" },
      { type: "p", text: "Since 2019, personal data used in collection has been regulated. A creditor is the data controller; a collection agency acting on its instructions is a processor. That relationship needs a written agreement, and the creditor remains accountable for what the agency does with the data. Publishing a debtor's details, or bulk-messaging their contact list, exposes the creditor first." },
      { type: "quote", text: "The creditor is accountable for the agency's conduct. Choosing a cheap collector is a governance decision, not a procurement one." },
      { type: "h2", text: "What compliant recovery actually looks like" },
      { type: "p", text: "A compliant process is slower to start and faster to finish. Contact is made with the named debtor. The balance and its basis are explained. The debtor is given a chance to dispute it, and a genuine dispute pauses collection until it is resolved. Where the debtor can pay something, an arrangement is written down with dates and amounts. Every contact is logged, because the log is what protects both sides later." },
      { type: "h3", text: "If a debtor complains" },
      { type: "p", text: "Take the complaint in writing, pause collection on the account, and investigate against the contact log. If the complaint is founded, say so and correct it. If it is not, respond with the record. Either way, the Office of the Data Protection Commissioner and the courts will look first at whether you had a process." },
      { type: "h2", text: "The practical test" },
      { type: "p", text: "Before any contact goes out, ask whether you would be comfortable if it were read aloud in court, or forwarded to a journalist. If the answer is no, it is not a recovery tactic. It is a future case against you." },
    ],
  },
  {
    slug: "why-county-own-source-revenue-underperforms",
    title: "Why county own-source revenue keeps missing target",
    description:
      "Counties usually do not have a rate problem — they have a register problem. Where own-source revenue actually leaks, and the sequence that closes the gap.",
    category: "County revenue",
    date: "2026-07-02",
    author: "Collection Africa",
    readingMinutes: 7,
    keywords: ["county own source revenue Kenya", "county revenue collection", "single business permit"],
    body: [
      { type: "p", text: "Most counties set an own-source revenue target, miss it, and respond by raising rates on the businesses already paying. That pushes compliant ratepayers toward non-compliance while the businesses contributing nothing continue to contribute nothing." },
      { type: "h2", text: "Where the revenue actually goes" },
      { type: "ul", items: [
        "Businesses trading with no permit at all, because nobody has enumerated the street they are on.",
        "Permits classified far below the actual scale of the business, often unchanged for a decade.",
        "Property never valued, or valued on a roll that predates the buildings standing on it.",
        "Cash-handled streams — markets, parking, cess — where receipting is manual and reconciliation is impossible.",
        "Arrears that are recorded, never billed, and quietly written off at year end.",
      ]},
      { type: "h2", text: "The register is the asset" },
      { type: "p", text: "Everything downstream depends on knowing who owes what. A county that rebuilds its register — enumerating on the ground, geo-referencing each entry, and matching it back to existing records — usually finds that the legislated revenue is substantially larger than the budgeted revenue. No new charge is introduced. The charge that already exists simply reaches the people it applies to." },
      { type: "h2", text: "Billing before enforcement" },
      { type: "p", text: "The instinct after enumeration is to enforce. It is the wrong first move. A ratepayer who has never received a bill has a legitimate grievance, and closure notices against them generate litigation and political heat. Bill first, state the basis of the charge plainly, give a payment route that works from a phone, and allow a window. Enforcement then applies to a much smaller group of genuine refusers, and it holds up." },
      { type: "quote", text: "Enforcement against someone who was never billed is a court case. Enforcement against someone who was billed three times is a collection." },
      { type: "h2", text: "Digitising is not the same as fixing" },
      { type: "p", text: "A revenue system installed on top of a broken register produces the same shortfall with better dashboards. Sequence matters: enumerate, reconcile, bill, collect arrears, then automate. Counties that reverse that order tend to procure a second system within three years." },
      { type: "h2", text: "Make the gains survive the contract" },
      { type: "p", text: "Whoever does the work, insist that county staff are trained on the register and the reporting, and that the data is the county's from the first day. Revenue capability that leaves when the consultant leaves was never capability." },
    ],
  },
  {
    slug: "cutting-arrears-before-they-start",
    title: "The cheapest recovery is the arrear that never happens",
    description:
      "Three changes at origination and billing that reduce the volume reaching collections — and why a reminder sent three days early outperforms a demand letter sent thirty days late.",
    category: "Credit management",
    date: "2026-05-27",
    author: "Collection Africa",
    readingMinutes: 5,
    keywords: ["reduce bad debt Kenya", "credit control best practice", "payment reminder strategy"],
    body: [
      { type: "p", text: "Every shilling that reaches a collections desk has already cost you something: staff time, system time, the relationship, and eventually a commission. The work that prevents it is unglamorous and far cheaper." },
      { type: "h2", text: "Verify at origination, not at default" },
      { type: "p", text: "A large share of untraceable debtors were untraceable on day one — the phone number was never called back, the employer was never confirmed, the physical address was a description rather than a location. Thirty seconds of verification at application is worth more than a full skip trace eighteen months later." },
      { type: "h2", text: "Move the reminder earlier" },
      { type: "p", text: "The single highest-return change most lenders can make is sending a reminder three days before the due date rather than a demand after it. Pre-due reminders convert at a much higher rate than post-due ones, because at that point the customer still has the money and no defensiveness. Once an account is late, you are competing with every other creditor and with the customer's embarrassment." },
      { type: "ul", items: [
        "Three days before due: amount, date, payment route. Nothing else.",
        "On the due date: the same message, shorter.",
        "Seven days late: a named person to call, and an offer to arrange.",
        "Thirty days late: escalation, with the arrangement offer still open.",
      ]},
      { type: "h2", text: "Make paying easier than avoiding" },
      { type: "p", text: "If a customer has to call an office during working hours to find out what they owe, some of them will simply not do it. Put the balance in the message. Put the paybill in the message. Accept partial payment without a phone call. Friction on the payment path is indistinguishable from unwillingness to pay, and you cannot tell them apart in your data." },
      { type: "quote", text: "Most people who are not paying you are not refusing. They are avoiding an awkward conversation. Remove the conversation." },
      { type: "h2", text: "Train the first conversation" },
      { type: "p", text: "The collector's opening thirty seconds determines whether the call ends in an arrangement or a hang-up. Teams that are trained to ask what the customer can pay, rather than demand what is owed, consistently record higher promise-to-pay conversion — and far fewer complaints." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const categories = ["All", "Debt recovery", "County revenue", "Credit management", "Compliance"] as const;
