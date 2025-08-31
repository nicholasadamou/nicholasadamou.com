import { MDXRemote } from "next-mdx-remote/rsc";
import Alert from "@/components/mdx/Alert";
import LinkPreview from "@/components/mdx/LinkPreview";
import PlantUML from "@/components/mdx/PlantUML";
import CustomImage from "@/components/mdx/Image";
import ImageFromContent from "@/components/mdx/ImageFromContent";
import CustomLink from "@/components/mdx/CustomLink";
import YouTubeEmbed from "@/components/mdx/YouTube/YouTubeEmbed";
import SourceCodeAccess from "@/components/mdx/GitHub/SourceCodeAccess";
import Latex from "@/components/mdx/Latex";

// Import plugins dynamically to avoid preset issues
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "@mapbox/rehype-prism";
const remarkPlantuml = require("@akebifiky/remark-simple-plantuml");

const components = {
  Image: CustomImage,
  ImageFromContent: ImageFromContent,
  a: CustomLink,
  Link: CustomLink,
  Alert: Alert,
  LinkPreview: LinkPreview,
  plantuml: PlantUML,
  PlantUML: PlantUML,
  YouTubeEmbed: YouTubeEmbed,
  SourceCodeAccess: SourceCodeAccess,
  latex: Latex,
};

interface MDXRendererProps {
  source: string;
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkPlantuml],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            rehypePrism,
            rehypeKatex,
          ],
        },
      }}
    />
  );
}
