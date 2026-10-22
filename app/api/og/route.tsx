import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Social preview cards, generated on demand.
 * /api/og?title=Debt%20collection
 */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Collection Africa").slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1b2149",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#ffffff",
              color: "#1b2149",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            CA
          </div>
          <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 600 }}>Collection Africa</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 110, height: 5, background: "#d4a029", marginBottom: 34 }} />
          <div style={{ color: "#ffffff", fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            {title}
          </div>
        </div>

        <div style={{ color: "#aab4d2", fontSize: 24 }}>
          Ethical recovery across Kenya since 2001
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
