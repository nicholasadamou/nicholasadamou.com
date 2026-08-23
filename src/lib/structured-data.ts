import { getBaseUrl } from "@/lib/og";

const SAME_AS = [
  "https://github.com/nicholasadamou",
  "https://www.linkedin.com/in/nicholas-adamou",
  "https://leetcode.com/nicholasadamou",
  "https://www.hackerrank.com/profile/nicholas_adamou",
  "https://codepen.io/nicholasadamou",
  "https://vsco.co/nicholasadamou",
  "https://nicholasadamou.gumroad.com",
  "https://www.credly.com/users/nicholas-adamou",
];

export function getPersonJsonLd() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nicholas Adamou",
    url: baseUrl,
    image: `${baseUrl}/images/avatar/nicholas-adamou.jpeg`,
    jobTitle: "Senior Software Engineer",
    description:
      "Senior software engineer passionate about making the world better through software.",
    worksFor: {
      "@type": "Organization",
      name: "Onebrief",
      url: "https://www.onebrief.com",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Georgia Institute of Technology",
        url: "https://www.gatech.edu",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Cornell College",
        url: "https://www.cornellcollege.edu",
      },
    ],
    sameAs: SAME_AS,
  };
}

/**
 * Represents Nicholas Adamou as an independent practice (the /contact page
 * offers freelance/consulting work). No public email, phone, or street
 * address is published anywhere on the site, so those ContactPoint fields
 * are intentionally omitted rather than fabricated. `address` is limited to
 * the country he operates from (consistent with his US-based employers and
 * education listed elsewhere on the site) rather than a specific location.
 */
export function getOrganizationJsonLd() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nicholas Adamou",
    url: baseUrl,
    logo: `${baseUrl}/images/avatar/nicholas-adamou.jpeg`,
    founder: {
      "@type": "Person",
      name: "Nicholas Adamou",
    },
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${baseUrl}/contact`,
    },
  };
}
