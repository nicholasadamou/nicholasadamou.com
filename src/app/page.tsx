import { getAllArticles } from "@/lib/content/mdx";
import { resolveImageUrl } from "@/lib/image/unsplash";
import HomePage from "@/components/home/HomePage";
import {
  getPersonJsonLd,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/structured-data";

export default function Home() {
  const articles = getAllArticles()
    .slice(0, 5)
    .map(({ slug, title, date, readTime, image }) => ({
      slug,
      title,
      date,
      readTime,
      image: image ? resolveImageUrl(image) : null,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPersonJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebSiteJsonLd()),
        }}
      />
      <HomePage articles={articles} />
    </>
  );
}
