"use client";

import Script from "next/script";

/**
 * Tawk.to live chat + AI Assist.
 *
 * Renders nothing until NEXT_PUBLIC_TAWK_PROPERTY_ID is set, so the site is
 * safe to deploy before the client has a Tawk account.
 *
 * Loading strategy is "lazyOnload": the widget never competes with the page
 * for main-thread time, which protects the Core Web Vitals scores that feed
 * into search ranking.
 *
 * Setup instructions: docs/user-guide.md, section 3.
 */
export function TawkWidget() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ?? "1i000000000";

  if (!propertyId) return null;

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        // Offset so the Tawk bubble does not sit under our own assistant button.
        Tawk_API.customStyle = { visibility: { desktop: { xOffset: 20, yOffset: 76, position: 'br' },
                                               mobile:  { xOffset: 12, yOffset: 76, position: 'br' } } };
        (function () {
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "https://embed.tawk.to/${propertyId}/${widgetId}";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
