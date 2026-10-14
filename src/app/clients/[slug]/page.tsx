import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { clients } from "@/lib/content/clients";
import { getCaseStudy } from "@/lib/content/case-studies";
import { pageMetadata, generateOGUrl } from "@/lib/og";
import CaseStudy from "@/components/clients/CaseStudy";
import Mermaid from "@/components/mdx/Mermaid";
import { ContentLink } from "@/components/ui/ContentLink";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return clients.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const title = `${study.name} — Website case study`;
  const metadata = pageMetadata(
    title,
    study.description,
    `/clients/${study.slug}`,
    "clients"
  );
  const image = generateOGUrl({
    title,
    description: study.description,
    type: "clients",
    image: `/images/clients/${study.slug}.webp`,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: image, width: 1200, height: 630, alt: study.name }],
    },
    twitter: { ...metadata.twitter, images: [image] },
  };
}
function CodeBlock({
  children,
}: {
  children?: ReactElement<{ className?: string; children?: string }>;
}) {
  return children?.props.className === "language-mermaid" ? (
    <Mermaid chart={String(children.props.children).trim()} />
  ) : (
    <pre>{children}</pre>
  );
}
export default async function ClientCaseStudy({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  return (
    <CaseStudy slug={study.slug} stack={study.stack} readTime={study.readTime}>
      <MDXRemote
        source={study.content}
        components={{ a: ContentLink, pre: CodeBlock }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </CaseStudy>
  );
}
