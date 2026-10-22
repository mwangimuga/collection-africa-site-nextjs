export const site = {
  legalName: "Collection Africa Kenya Limited",
  name: "Collection Africa",
  founded: 2001,
  tagline: "Ethical recovery. Measurable results.",
  description:
    "Collection Africa Kenya Limited recovers debt, maximises county revenue and trains credit teams across Kenya. Licensed, ISO-aligned and ethical since 2001.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.collectionafrica.co.ke",
  locale: "en_KE",
  phone: "+254116028888",
  phoneDisplay: "+254 116 028 888",
  email: "marketing@collectionafrica.co.ke",
  careersEmail: "hr@collectionafrica.co.ke",
  hours: "Monday to Friday, 8:00am – 5:00pm EAT",
  linkedin: "https://www.linkedin.com/company/collection-africa",
  // TODO(client): confirm registration number and any licence/permit numbers you
  // want published. Regulators and procurement teams look for these.
  registration: "",
};

export type Office = {
  city: string;
  label: string;
  street: string;
  locality: string;
  postalCode?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  isHeadOffice?: boolean;
};

export const offices: Office[] = [
  {
    city: "Nairobi",
    label: "Head office",
    street: "7th Floor, Rhapta Heights, Rhapta Road, Westlands",
    locality: "Nairobi",
    phone: "+254116028888",
    lat: -1.2647,
    lng: 36.7938,
    isHeadOffice: true,
  },
  {
    city: "Kisumu",
    label: "Western region",
    street: "Mezzanine Floor, Mega City Mall",
    locality: "Kisumu",
  },
  {
    city: "Nakuru",
    label: "Rift Valley region",
    street: "7th Floor, C.K. Patel Building",
    locality: "Nakuru",
  },
];

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];
