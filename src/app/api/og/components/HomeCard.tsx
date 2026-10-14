/* eslint-disable @next/next/no-img-element -- Embedded assets for ImageResponse. */
import { brand } from "@/lib/brand";
import type { ProcessedOGParams } from "../types";

export function HomeCard({
  processedImage,
  companyLogo,
  experienceLogos = [],
  theme = "dark",
}: ProcessedOGParams) {
  const dark = theme === "dark";
  const background = dark ? brand.colors.ink : brand.colors.paper;
  const foreground = dark ? brand.colors.paper : brand.colors.ink;
  const secondary = dark ? brand.colors.stone : "#57534e";
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
          position: "absolute",
          right: 0,
          top: 0,
          width: 550,
          height: 526,
          background: "#080808",
        }}
      />
      {processedImage && (
        <img
          src={processedImage}
          alt="Nicholas Adamou"
          width={550}
          height={526}
          style={{
            position: "absolute",
            right: -45,
            top: 0,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
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
          width: 620,
        }}
      >
        <span style={{ fontSize: 33, fontWeight: 600, letterSpacing: -1 }}>
          {brand.name}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 17,
            color: secondary,
            marginTop: 20,
          }}
        >
          <span>{brand.role} at</span>
          {companyLogo && (
            <img
              src={companyLogo}
              alt="Onebrief"
              width={34}
              height={34}
              style={{ borderRadius: 17 }}
            />
          )}
          <span>Onebrief</span>
        </div>
        <div
          aria-label={brand.tagline}
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            fontSize: 67,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: -2.7,
          }}
        >
          <span>Making the world</span>
          <span>better through</span>
          <span style={{ color: secondary }}>software</span>
        </div>
        <span style={{ marginTop: 28, fontSize: 21, color: secondary }}>
          Websites, software & systems.
        </span>
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
        {[
          { name: "IBM", detail: "Previous engineering roles" },
          { name: "Apple", detail: "Previous contract role" },
          { name: "Lockheed Martin", detail: "Previous role · Space" },
        ].map((item, index) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              width: "33.33%",
              alignItems: "center",
              gap: 16,
            }}
          >
            {experienceLogos[index] && (
              <img
                src={experienceLogos[index]}
                alt={item.name}
                width={52}
                height={52}
                style={{ borderRadius: 26 }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{item.name}</span>
              <span style={{ fontSize: 13, color: secondary }}>
                {item.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
