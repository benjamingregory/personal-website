import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "hsl(24, 10%, 10%)",
          color: "hsl(48, 33%, 99%)",
          borderRadius: 7,
          fontSize: 20,
          fontWeight: 600,
          fontFamily: "sans-serif",
        }}
      >
        B
      </div>
    ),
    size,
  );
}
