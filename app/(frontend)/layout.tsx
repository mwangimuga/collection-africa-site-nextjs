import type { Metadata, Viewport } from "next";
import "./globals.css";
import { sans, serif } from "./fonts";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TawkWidget } from "@/components/tawk-widget";
import { Assistant } from "@/components/assistant";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { baseUrl, organisationSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/content/site";
import { getJobs } from "@/lib/cms";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Collection Africa — ethical debt recovery in Kenya",
    template: "%s | Collection Africa",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, email: true, address: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1b2149",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const assistantOn = process.env.NEXT_PUBLIC_ENABLE_ASSISTANT !== "false";
  const openRoles = (await getJobs()).length;

  return (
    <html lang="en-KE" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={[organisationSchema(), websiteSchema()]} />
        <Analytics />
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader openRoles={openRoles} />
        <main id="main">{children}</main>
        <SiteFooter />
        {assistantOn && <Assistant />}
        <TawkWidget />
      </body>
    </html>
  );
}
