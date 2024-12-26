import { allNotes } from "contentlayer/generated";
import ContentPage from "@/app/components/ContentPage";

import {generateMetadata} from "./metadata";
export {generateMetadata};

export default function NotePage({ params }: { params: { slug: string } }) {
	const note = allNotes.find((n) => n.slug === params.slug);
	return <ContentPage content={note} type="note" allContent={allNotes} />;
}
