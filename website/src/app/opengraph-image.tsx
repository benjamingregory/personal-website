import { ImageResponse } from "next/og";

export const alt = "Ben Gregory — engineer, founder, and writer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "hsl(48, 33%, 99%)",
          color: "hsl(24, 10%, 10%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "hsl(24, 6%, 42%)",
          }}
        >
          hi, there.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Ben Gregory
          </div>
          <div style={{ fontSize: 36, color: "hsl(24, 6%, 42%)" }}>
            Building Kasava — an AI workflow tool for engineering teams.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "hsl(24, 6%, 42%)",
          }}
        >
          <div>benjaminrgregory.com</div>
          <div
            style={{
              width: 220,
              height: 2,
              backgroundColor: "hsl(24, 10%, 10%)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
