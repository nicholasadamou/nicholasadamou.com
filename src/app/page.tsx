import { getAllArticles } from "@/lib/content/mdx";
import { resolveImageUrl } from "@/lib/image/unsplash";
import HomePage from "@/components/home/HomePage";

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

  return <HomePage articles={articles} />;
}
