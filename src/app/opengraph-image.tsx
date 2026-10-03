import { ImageResponse } from "next/og";

export const alt = "ReviewGate: QR & NFC ke Google Review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg,#1a73e8,#174ea6)",
          color: "#fff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, opacity: 0.85 }}>QR & NFC ke Google Review</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, marginTop: 20 }}>ReviewGate</div>
        <div style={{ display: "flex", fontSize: 42, marginTop: 28, textAlign: "center" }}>
          Satu kartu, ulasan Google jadi satu ketukan
        </div>
      </div>
    ),
    { ...size }
  );
}