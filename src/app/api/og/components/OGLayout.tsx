/* eslint-disable @next/next/no-img-element -- Embedded assets for ImageResponse. */
import { AVATAR_BASE64 } from "../avatar-data";
import { HomeCard } from "./HomeCard";
import { brand } from "@/lib/brand";
import { ProcessedOGParams } from "../types";

export const OGLayout = (params: ProcessedOGParams) => {
  if (params.type === "homepage") return <HomeCard {...params} />;
  const {
    title,
    description,
    headerText,
    processedImage,
    theme = "dark",
  } = params;
  const dark = theme === "dark";
  const background = dark ? brand.colors.ink : brand.colors.paper;
  const foreground = dark ? brand.colors.paper : brand.colors.ink;
  const secondary = dark ? brand.colors.stone : "#57534e";
  const heading = title.length > 130 ? `${title.slice(0, 127).trim()}…` : title;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background,
        color: foreground,
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 0,
          top: 0,
          width: 550,
          height: 526,
          background: dark ? brand.colors.surface : "#e7e5e4",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={processedImage || AVATAR_BASE64}
          alt={processedImage ? title : brand.name}
          width={550}
          height={526}
          style={{
            objectFit: "cover",
            transform: processedImage ? undefined : "translateX(45px)",
          }}
        />
      </div>
      <svg
        width="1200"
        height="526"
        viewBox="0 0 1200 526"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path d="M0 0H760L670 526H0Z" fill={background} />
        <path d="M750 0H760L670 526H660Z" fill={secondary} />
      </svg>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 44,
          left: 54,
          flexDirection: "column",
          width: 610,
        }}
      >
        <span style={{ fontSize: 33, fontWeight: 600, letterSpacing: -1 }}>
          {brand.name}
        </span>
        <span
          style={{
            marginTop: 20,
            fontSize: 17,
            color: secondary,
            letterSpacing: 2,
          }}
        >
          {headerText.toUpperCase()}
        </span>
        <div
          style={{
            display: "flex",
            marginTop: 38,
            fontSize: heading.length > 85 ? 40 : heading.length > 50 ? 50 : 67,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2.5,
          }}
        >
          {heading}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 21,
              lineHeight: 1.4,
              color: secondary,
            }}
          >
            {description.length > 160
              ? `${description.slice(0, 157).trim()}…`
              : description}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 104,
          alignItems: "center",
          borderTop: `3px solid ${secondary}`,
          padding: "20px 42px",
          background,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5 }}>
          {brand.tagline}
        </span>
      </div>
    </div>
  );
};
