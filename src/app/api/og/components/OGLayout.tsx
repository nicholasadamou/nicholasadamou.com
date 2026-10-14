/* eslint-disable @next/next/no-img-element -- Embedded assets for ImageResponse. */
import { Code2, Layers3, PenLine, Github } from "lucide-react";
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
    type,
    theme = "dark",
  } = params;
  const dark = theme === "dark";
  const background = dark ? brand.colors.ink : brand.colors.paper;
  const foreground = dark ? brand.colors.paper : brand.colors.ink;
  const secondary = dark ? brand.colors.stone : "#57534e";
  const Icon =
    type === "clients"
      ? Layers3
      : type === "note" || type === "notes"
        ? PenLine
        : Code2;
  const heading = title.length > 130 ? `${title.slice(0, 127).trim()}…` : title;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
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
        {processedImage ? (
          <img
            src={processedImage}
            alt={title}
            width={550}
            height={526}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 34,
              paddingLeft: 50,
            }}
          >
            <Icon size={156} color={secondary} strokeWidth={1} />
            <span
              style={{
                fontSize: 16,
                color: secondary,
                textAlign: "center",
                width: 300,
                lineHeight: 1.5,
              }}
            >
              {brand.tagline}
            </span>
          </div>
        )}
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
          bottom: 104,
          right: 0,
          padding: "48px 34px 22px",
          width: 420,
          justifyContent: "flex-end",
          color: "#fafaf9",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          fontSize: 16,
        }}
      >
        nicholasadamou.com
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
          {
            Icon: Github,
            name: "Open source",
            detail: "Tools built to be shared",
          },
          {
            Icon: Layers3,
            name: "Client work",
            detail: "Websites with purpose",
          },
          {
            Icon: PenLine,
            name: "Notes",
            detail: "Ideas from building software",
          },
        ].map(({ Icon: FooterIcon, name, detail }) => (
          <div
            key={name}
            style={{
              display: "flex",
              width: "33.33%",
              alignItems: "center",
              gap: 16,
            }}
          >
            <FooterIcon size={38} color={secondary} strokeWidth={1.5} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: 13, color: secondary }}>{detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
