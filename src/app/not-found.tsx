import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-2xl px-5 pt-24 pb-32 sm:pt-32 sm:pb-48">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">Page not found</h1>
            <p className="text-sm opacity-60">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved.
            </p>
          </div>

          <div className="space-y-3 text-sm leading-relaxed">
            <p>Here&apos;s where to look next:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <Link href="/" className="underline">
                  Home
                </Link>{" "}
                — bio, projects, notes, and photography
              </li>
              <li>
                <Link href="/about" className="underline">
                  About
                </Link>{" "}
                — background, work history, and how to reach me
              </li>
              <li>
                <Link href="/projects" className="underline">
                  Projects
                </Link>{" "}
                — open-source projects and developer tools
              </li>
              <li>
                <Link href="/notes" className="underline">
                  Notes
                </Link>{" "}
                — writing on software engineering and architecture
              </li>
              <li>
                <Link href="/contact" className="underline">
                  Contact
                </Link>{" "}
                — get in touch about a project
              </li>
              <li>
                <a href="/sitemap.xml" className="underline">
                  Sitemap
                </a>{" "}
                — full list of indexable pages
              </li>
              <li>
                <a href="/llms.txt" className="underline">
                  llms.txt
                </a>{" "}
                — a machine-readable guide to this site for AI agents
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
