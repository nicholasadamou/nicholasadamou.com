import { useMDXComponent } from "next-contentlayer/hooks";

import Alert from "@/app/components/mdx/Alert";
import LinkPreview from "@/app/components/mdx/LinkPreview";
import PlantUML from "@/app/components/mdx/PlantUML";
import CustomImage from "@/app/components/mdx/Image";
import CustomLink from "@/app/components/mdx/CustomLink";
import YouTubeEmbed from "@/app/components/mdx/YouTube/YouTubeEmbed";

const components = {
	Image: CustomImage,
	a: CustomLink,
	Link: CustomLink,
	Alert: Alert,
	LinkPreview: LinkPreview,
	plantuml: PlantUML,
	PlantUML: PlantUML,
	YouTubeEmbed: YouTubeEmbed,
};

export default function MdxWrapper({ code }: { code: string }) {
  const Component = useMDXComponent(code, { components });

  return <Component components={components} />;
}
