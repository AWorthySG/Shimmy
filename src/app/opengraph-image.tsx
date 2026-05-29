import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const alt = "Shimmy — Beauty Studio Singapore | Brows & Press-On Nails";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Load the colocated hero photo and inline it as a data URL. The route is
  // prerendered at build time (Node), so read from the filesystem — fetch()
  // can't resolve file:// URLs during prerender.
  const photo = await readFile(new URL("./og-hero.jpg", import.meta.url));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#1c1816",
          fontFamily: "serif",
        }}
      >
        {/* Flagship photo, full-bleed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Legibility scrim — darker on the left where the text sits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(20,16,14,0.80) 0%, rgba(20,16,14,0.45) 45%, rgba(20,16,14,0.05) 78%)",
          }}
        />

        {/* Brand text */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              width: 92,
              height: 3,
              backgroundColor: "#dcc9a8",
              marginBottom: 26,
            }}
          />
          <div
            style={{
              fontSize: 108,
              color: "#ffffff",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            Shimmy
          </div>
          <div
            style={{
              fontSize: 27,
              color: "#f1e3dc",
              letterSpacing: "0.22em",
              marginTop: 18,
              textTransform: "uppercase" as const,
            }}
          >
            Beauty Studio · Singapore
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#e7d2c8",
              letterSpacing: "0.06em",
              marginTop: 30,
            }}
          >
            Brows &amp; Handcrafted Press-On Nails
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
