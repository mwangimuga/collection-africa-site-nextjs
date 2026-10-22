"use client";

import { useState } from "react";
import Link from "next/link";

type Tone = "dark" | "light";

/**
 * Renders the uploaded wordmark if it exists, and falls back to the plain
 * "CA" mark used throughout development if it doesn't.
 *
 * This is a client component specifically so the fallback can work with
 * <img onError>: a public/ path can't be checked for existence at build
 * time, and this way nothing breaks — before the real logo is uploaded, or
 * if the file is ever removed — it just quietly shows the placeholder.
 */
export function Logo({ tone = "dark", href = "/" }: { tone?: Tone; href?: string }) {
  const [broken, setBroken] = useState(false);
  const src = tone === "light" ? "/assets/logo/logo-wordmark-white.png" : "/assets/logo/logo-wordmark.png";

  return (
    <Link href={href} className="brand" aria-label="Collection Africa home">
      {!broken ? (
        <img
          src={src}
          alt="Collection Africa"
          className="brand__logo"
          height={40}
          onError={() => setBroken(true)}
        />
      ) : (
        <>
          <span className="brand__mark" aria-hidden="true">CA</span>
          <span className="brand__name">
            Collection Africa
            <span>Kenya Limited</span>
          </span>
        </>
      )}
    </Link>
  );
}
