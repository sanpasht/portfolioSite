import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/content";

export const runtime = "nodejs";

/**
 * Generated OpenGraph images.
 *
 * Deliberately typographic and system-font-only: no network fetch for a font
 * file, so the image can't fail to render at share time.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const settings = await getSettings();

  const title = (searchParams.get("title") || settings.name).slice(0, 110);
  const subtitle = (
    searchParams.get("subtitle") ||
    settings.tagline ||
    settings.role
  ).slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fdfdfc",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#6b6b70",
            letterSpacing: "-0.01em",
          }}
        >
          {settings.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 56 : 68,
              fontWeight: 600,
              color: "#1c1c1f",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#6b6b70" }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 6,
            width: 96,
            background: "#2f6fd0",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
