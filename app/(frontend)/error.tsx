"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[app] render error", error);
  }, [error]);

  return (
    <section className="band">
      <div className="shell">
        <h1>Something broke on our side</h1>
        <p className="lede">
          This page failed to load. Trying again usually works. If it keeps happening,
          call +254 116 028 888 and we&apos;ll help directly.
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={reset}>Try again</button>
          <Link href="/" className="btn btn--outline">Go to the home page</Link>
        </div>
      </div>
    </section>
  );
}
