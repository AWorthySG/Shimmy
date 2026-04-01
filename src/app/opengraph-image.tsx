import { ImageResponse } from "next/og";

export const alt = "Shimmy — Beauty Studio Singapore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1e3dc",
          fontFamily: "serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: "#536442",
            marginBottom: 32,
          }}
        />

        {/* Main title */}
        <div
          style={{
            fontSize: 96,
            fontFamily: "serif",
            color: "#2c2c2c",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          Shimmy
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#536442",
            letterSpacing: "0.15em",
            marginTop: 16,
            textTransform: "uppercase" as const,
          }}
        >
          Beauty Studio · Singapore
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: "#536442",
            marginTop: 40,
            marginBottom: 40,
          }}
        />

        {/* Bottom tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#6b5e58",
            letterSpacing: "0.1em",
          }}
        >
          Brows & Press-On Nails
        </div>
      </div>
    ),
    { ...size }
  );
}
