import { describe, it, expect } from "vitest";
import {
  getPersonJsonLd,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/structured-data";

describe("getPersonJsonLd", () => {
  it("produces valid Person schema with required identity fields", () => {
    const data = getPersonJsonLd();

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Nicholas Adamou");
    expect(data.url).toMatch(/^https?:\/\//);
    expect(data.description.length).toBeGreaterThan(0);
    expect(Array.isArray(data.sameAs)).toBe(true);
    expect(data.sameAs.length).toBeGreaterThan(0);
    data.sameAs.forEach((link) => expect(link).toMatch(/^https:\/\//));
  });

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(getPersonJsonLd())).not.toThrow();
  });
});

describe("getOrganizationJsonLd", () => {
  it("produces valid Organization schema without fabricated contact details", () => {
    const data = getOrganizationJsonLd();

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Organization");
    expect(data.name).toBe("Nicholas Adamou");
    expect(data.url).toMatch(/^https?:\/\//);
    expect(data.contactPoint["@type"]).toBe("ContactPoint");
    expect(data.contactPoint.url).toContain("/contact");
    // No email/phone/street address is published on the site, so none
    // should be invented here — asserting the keys stay absent guards
    // against drift. Only the country (an already-public fact, matching
    // his US-based employers/education) is included in `address`.
    expect(data.contactPoint).not.toHaveProperty("email");
    expect(data.contactPoint).not.toHaveProperty("telephone");
    expect(data.address["@type"]).toBe("PostalAddress");
    expect(data.address.addressCountry).toBe("US");
    expect(data.address).not.toHaveProperty("streetAddress");
    expect(data.address).not.toHaveProperty("addressLocality");
  });

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(getOrganizationJsonLd())).not.toThrow();
  });
});

describe("getWebSiteJsonLd", () => {
  it("links to nicholasadamou developer resources", () => {
    const data = getWebSiteJsonLd();

    expect(data["@type"]).toBe("WebSite");
    expect(data.alternateName).toBe("nicholasadamou");
    expect(data.hasPart.name).toBe("nicholasadamou developer resources");
    expect(data.hasPart.url).toContain("/developers");
  });

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(getWebSiteJsonLd())).not.toThrow();
  });
});
