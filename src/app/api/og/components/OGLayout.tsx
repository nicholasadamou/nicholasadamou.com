import { HomeCard } from "./HomeCard";
/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded image data. */
import { ArrowUpRight, Code2, Layers3, PenLine, Github } from "lucide-react";
import { brand } from "@/lib/brand";
import { ProcessedOGParams } from "../types";

export const OGLayout = ({
  title,
  description,
  headerText,
  processedImage,
  companyLogo,
  experienceLogos,
  type,
  theme = "dark",
}: ProcessedOGParams) => {
  if (type === "homepage")
    return (
      <HomeCard
        title={title}
        headerText={headerText}
        type={type}
        theme={theme}
        processedImage={processedImage}
        companyLogo={companyLogo}
        experienceLogos={experienceLogos}
      />
    );
  const dark = theme === "dark";
  const color = dark ? brand.colors.paper : brand.colors.ink;
  const muted = dark ? "#a8a29e" : "#57534e";
  const border = dark ? "#44403c" : "#d6d3d1";
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
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "48px 60px",
        background: dark ? brand.colors.ink : brand.colors.paper,
        color,
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${border}`,
          paddingBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              padding: 12,
              border: `1px solid ${border}`,
              borderRadius: 12,
            }}
          >
            <Icon size={26} color={color} strokeWidth={1.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{brand.name}</span>
        </div>
        <span style={{ fontSize: 16, color: muted, letterSpacing: 2 }}>
          {headerText.toUpperCase()}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 44,
          flexGrow: 1,
          padding: "24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: processedImage ? 710 : 1000,
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize:
                heading.length > 85 ? 44 : heading.length > 50 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2.5,
            }}
          >
            {heading}
          </div>
          {description && (
            <div
              style={{
                display: "flex",
                fontSize: 23,
                color: muted,
                lineHeight: 1.45,
              }}
            >
              {description.length > 160
                ? `${description.slice(0, 157).trim()}…`
                : description}
            </div>
          )}
        </div>
        {processedImage && (
          <img
            src={processedImage}
            alt={title}
            width={260}
            height={260}
            style={{
              objectFit: "cover",
              borderRadius: 20,
              border: `1px solid ${border}`,
            }}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${border}`,
          paddingTop: 24,
          fontSize: 17,
          color: muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Github size={21} color={muted} />
          <span>nicholasadamou</span>
          <span style={{ marginLeft: 18 }}>
            Engineering · Client work · Notes
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>nicholasadamou.com</span>
          <ArrowUpRight size={22} color={color} />
        </div>
      </div>
    </div>
  );
};
