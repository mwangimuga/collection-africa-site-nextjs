import { Suspense } from "react";
import { SearchClient } from "./search-client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search the Collection Africa website.",
  path: "/search",
  // Search result pages carry no unique value for the index.
  noindex: true,
});

export default function SearchPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <Breadcrumbs trail={[{ name: "Search", path: "/search" }]} />
          <h1>Search</h1>
          <p className="lede">
            Ask a question in your own words. You&apos;ll get a short answer drawn from this
            site, plus the pages it came from.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="shell" style={{ maxWidth: "48rem" }}>
          <Suspense fallback={<p className="meta">Loading…</p>}>
            <SearchClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
