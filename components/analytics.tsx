"use client";

import Script from "next/script";

/**
 * Google Tag Manager, loaded only when NEXT_PUBLIC_GTM_ID is set.
 * Put GA4, Ads and any other tags inside GTM rather than adding more
 * scripts here — one container is easier to govern and far kinder to
 * page speed.
 */
export function Analytics() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtm) return null;

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtm}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

/** Fire a conversion event into the dataLayer. Called on successful form submit. */
export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...payload });
}
