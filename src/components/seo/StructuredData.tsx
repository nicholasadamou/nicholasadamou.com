import React from "react";

interface PersonSchema {
  name: string;
  url: string;
  image?: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
}

interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
}

interface ArticleSchema {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  image?: string;
  wordCount?: number;
}

interface WebSiteSchema {
  name: string;
  url: string;
  description: string;
  author: PersonSchema;
}

interface StructuredDataProps {
  type: "person" | "organization" | "article" | "website";
  data: PersonSchema | OrganizationSchema | ArticleSchema | WebSiteSchema;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = "https://nicholasadamou.com";

    switch (type) {
      case "person":
        const personData = data as PersonSchema;
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          name: personData.name,
          url: personData.url,
          image: personData.image,
          jobTitle: personData.jobTitle,
          description: personData.description,
          sameAs: personData.sameAs,
          knowsAbout: [
            "Software Engineering",
            "Full Stack Development",
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
            "JavaScript",
            "Web Development",
            "Cloud Architecture",
            "DevOps",
          ],
        };

      case "organization":
        const orgData = data as OrganizationSchema;
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: orgData.name,
          url: orgData.url,
          logo: orgData.logo,
          description: orgData.description,
        };

      case "article":
        const articleData = data as ArticleSchema;
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articleData.headline,
          description: articleData.description,
          url: articleData.url,
          datePublished: articleData.datePublished,
          dateModified: articleData.dateModified || articleData.datePublished,
          author: {
            "@type": "Person",
            name: articleData.author.name,
            url: articleData.author.url,
          },
          publisher: {
            "@type": "Person",
            name: articleData.author.name,
            url: articleData.author.url,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleData.url,
          },
          image: articleData.image
            ? `${baseUrl}${articleData.image}`
            : `${baseUrl}/nicholas-adamou.jpeg`,
          wordCount: articleData.wordCount,
        };

      case "website":
        const websiteData = data as WebSiteSchema;
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: websiteData.name,
          url: websiteData.url,
          description: websiteData.description,
          author: {
            "@type": "Person",
            name: websiteData.author.name,
            url: websiteData.author.url,
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${websiteData.url}/notes?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Pre-configured data for the person schema
export const nicholasAdamouPersonData: PersonSchema = {
  name: "Nicholas Adamou",
  url: "https://nicholasadamou.com",
  image: "https://nicholasadamou.com/nicholas-adamou.jpeg",
  jobTitle: "Full Stack Software Engineer",
  description:
    "Software Engineer passionate about making the world better through software.",
  sameAs: [
    "https://github.com/nicholasadamou",
    "https://linkedin.com/in/nicholas-adamou",
    "https://twitter.com/nicholasadamou",
  ],
};

export const websiteData: WebSiteSchema = {
  name: "Nicholas Adamou",
  url: "https://nicholasadamou.com",
  description:
    "Software Engineer passionate about making the world better through software.",
  author: nicholasAdamouPersonData,
};
