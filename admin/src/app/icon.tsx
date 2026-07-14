import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// 2×2 grid of the four project accents on the desk's ground color.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#191816",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          gap: 4,
          padding: 6,
        }}
      >
        {["#c98500", "#3987e5", "#e66767", "#199e70"].map((c) => (
          <div
            key={c}
            style={{ width: 9, height: 9, background: c, borderRadius: 2 }}
          />
        ))}
      </div>
    ),
    size,
  );
}
