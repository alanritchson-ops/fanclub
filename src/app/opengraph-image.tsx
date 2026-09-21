import { ImageResponse } from "next/og";

export const alt = "Alan Ritchson Fan Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          color: "white",
          background:
            "radial-gradient(120% 100% at 0% 40%, #b41f25 0%, #7d1217 32%, #3b0c10 60%, #150607 100%)",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.85, marginBottom: 24 }}>
          Alan Ritchson Fan Club
        </div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: -5,
            textTransform: "uppercase",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Where action</span>
          <span>speaks volumes.</span>
        </div>
      </div>
    ),
    size,
  );
}
