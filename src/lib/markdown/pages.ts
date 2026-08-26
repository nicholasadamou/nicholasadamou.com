import { getAllArticles, getArticleBySlug } from "@/lib/content/mdx";
import { projects } from "@/lib/projects/config";
import {
  connectLinks,
  credentials,
  developerResources,
  resumes,
  workplaces,
} from "@/lib/content/about-data";
import { privacySections } from "@/lib/content/privacy-data";
import { getBaseUrl } from "@/lib/og";

/**
 * Hand-authored Markdown mirrors of the prose on client-rendered pages.
 * Per https://acceptmarkdown.com, this excludes navigation, styles, and
 * layout wrappers, focusing on the same content a visitor reads.
 */

export function getHomeMarkdown(): string {
  const baseUrl = getBaseUrl();
  const featured = projects.filter((p) => p.featured);
  const recentArticles = getAllArticles().slice(0, 5);

  const lines = [
    "# Nicholas Adamou",
    "",
    "Hi, I'm Nick, a senior software engineer at [Onebrief](https://www.onebrief.com).",
    "",
    "I'm a senior software engineer who's worked at companies including [IBM](https://www.ibm.com), [Lockheed Martin, Space](https://www.lockheedmartin.com), [Apple](https://www.apple.com), and [Fly Blackbird (acquired by SurfAir)](https://www.surfair.com).",
    "",
    "I hold a [Master of Science in Computer Science](https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e) from [Georgia Institute of Technology](https://www.gatech.edu) and a [Bachelor of Arts in Computer Science](https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing) from [Cornell College](https://www.cornellcollege.edu). I'm passionate about making the world better through software.",
    "",
    `More about me: ${baseUrl}/about`,
    "",
    "## How to read this site",
    "",
    "Nicholas Adamou's personal site is organized for both people and agents.",
    "",
    "### People",
    "",
    `Start with the bio on this page, then continue to [About](${baseUrl}/about) for work history, [Projects](${baseUrl}/projects) for open-source tools, and [Notes](${baseUrl}/notes) for technical writing. Use [Contact](${baseUrl}/contact) for freelance or consulting inquiries.`,
    "",
    "### Agents",
    "",
    `Prefer [llms.txt](${baseUrl}/llms.txt) and [Nicholas Adamou developer resources](${baseUrl}/developers). Pages also serve Markdown when requested with \`Accept: text/markdown\`. The [sitemap](${baseUrl}/sitemap.xml) lists every indexable URL.`,
    "",
    "## Projects",
    "",
    ...featured.flatMap((p) => [`- [${p.name}](${p.href}): ${p.description}`]),
    `- [View all projects](${baseUrl}/projects)`,
    "",
    "## Notes",
    "",
    ...recentArticles.flatMap((a) => [
      `- [${a.title}](${baseUrl}/notes/${a.slug}) (${a.date})`,
    ]),
    `- [View all notes](${baseUrl}/notes)`,
    "",
    "## Photos",
    "",
    `A curated collection of photography work. [View gallery](${baseUrl}/gallery)`,
    "",
  ];

  return lines.join("\n");
}

export function getAboutMarkdown(): string {
  const baseUrl = getBaseUrl();

  const lines = [
    "# About",
    "",
    "A glimpse into me.",
    "",
    "I am a seasoned Senior Software Engineer with a strong academic foundation, holding a [Master of Science in Computer Science](https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e) from [Georgia Institute of Technology](https://www.gatech.edu) and a [Bachelor of Arts in Computer Science](https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing) from [Cornell College](https://www.cornellcollege.edu). My career is marked by a commitment to leveraging software engineering to create meaningful impact. I am a strong advocate for user-centered design and am passionate about creating well-designed products that are intuitive and easy to use.",
    "",
    "## What Got Me Into Coding",
    "",
    "My journey into programming began at a young age when my dad introduced me to the game [Asteroids](https://en.wikipedia.org/wiki/Asteroids_(video_game)) on [Windows 98](https://en.wikipedia.org/wiki/Windows_98). The simple yet captivating mechanics of navigating a spaceship and dodging asteroids sparked my curiosity about how computers worked and how games were created.",
    "",
    "Fast forward to 2007, when my dad bought me [Halo 3](https://en.wikipedia.org/wiki/Halo_3), my intrigue deepened. The expansive Halo universe captivated me, especially the elusive [Recon armor](https://halo.fandom.com/wiki/MJOLNIR_Powered_Assault_Armor/R_variant). Determined to unlock it, I scoured the web and discovered YouTube tutorials that showed how to modify my service record page on [Bungie.net](https://www.bungie.net). This required using developer tools to tweak some code — the experience of seeing the code behind the scenes fueled my desire to understand and create within the digital world.",
    "",
    "## Connect",
    "",
    ...connectLinks.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Credentials",
    "",
    ...credentials.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Developer Resources",
    "",
    ...developerResources.map(
      (r) =>
        `- [${r.label}](${r.href.startsWith("/") ? baseUrl + r.href : r.href})`
    ),
    "",
    "## Resume",
    "",
    ...resumes.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Photography",
    "",
    `Beyond software engineering, I have a passion for photography and visual storytelling. You can explore my work on [VSCO](https://vsco.co/nicholasadamou). [View gallery](${baseUrl}/gallery)`,
    "",
    "## Work",
    "",
    "I specialize in Full Stack Development and DevOps, focusing on creating scalable applications and optimizing development processes.",
    "",
    ...workplaces.map(
      (wp) =>
        `- [${wp.title}, ${wp.company}${wp.contract ? " (contract)" : ""}](${wp.href}) — ${wp.date}`
    ),
    "",
  ];

  return lines.join("\n");
}

export function getContactMarkdown(): string {
  const baseUrl = getBaseUrl();

  return [
    "# Let's talk about your project",
    "",
    "I help companies and individuals build out their digital presence.",
    "",
    "I work with startups, engineering teams, and individual founders to build reliable, well-tested software — from full-stack web applications and internal tooling to DevOps pipelines and cloud infrastructure. Whether you need a hand shipping a new feature, untangling technical debt, or someone to own a project end-to-end, tell me about what you're building and I'll get back to you within a couple of days.",
    "",
    `Use the contact form at ${baseUrl}/contact to get in touch. By submitting it, you agree to the [privacy policy](${baseUrl}/privacy).`,
    "",
  ].join("\n");
}

export function getPrivacyMarkdown(): string {
  const baseUrl = getBaseUrl();

  const lines = [
    "# Privacy Policy",
    "",
    "Your privacy matters. I'm committed to being transparent about how I collect, use, and protect your personal information.",
    "",
    ...privacySections.flatMap((s) => [`## ${s.title}`, "", s.description, ""]),
    "## Questions About Privacy?",
    "",
    `If you have any questions or concerns about this privacy policy, I'm here to help. Get in touch: ${baseUrl}/contact`,
    "",
  ];

  return lines.join("\n");
}

export function getProjectsMarkdown(): string {
  const lines = [
    "# Projects",
    "",
    `${projects.length} open-source projects and tools.`,
    "",
    ...projects.map((p) => {
      const tags = p.tags && p.tags.length > 0 ? ` (${p.tags.join(", ")})` : "";
      return `- [${p.name}](${p.href})${tags}: ${p.description}`;
    }),
    "",
  ];

  return lines.join("\n");
}

export function getNotesMarkdown(): string {
  const baseUrl = getBaseUrl();
  const articles = getAllArticles();

  const lines = [
    "# Notes",
    "",
    `${articles.length} posts about software engineering, architecture, and developer tools.`,
    "",
    ...articles.map(
      (a) =>
        `- [${a.title}](${baseUrl}/notes/${a.slug}) (${a.date}, ${a.readTime}): ${a.summary}`
    ),
    "",
  ];

  return lines.join("\n");
}

export function getNoteArticleMarkdown(slug: string): string | null {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  return [
    `# ${article.title}`,
    "",
    `${article.date} · ${article.readTime}`,
    "",
    article.body.raw,
    "",
  ].join("\n");
}

/**
 * Short recovery document for nonexistent paths. Served with HTTP 404 and
 * `Content-Type: text/markdown` when the client prefers markdown, so agents
 * can recover via sitemap / llms.txt / developer resources instead of
 * parsing an HTML shell.
 */
export function getNotFoundMarkdown(): string {
  const baseUrl = getBaseUrl();

  return [
    "# Page not found",
    "",
    "The page you're looking for doesn't exist or may have moved.",
    "",
    "## Where to look next",
    "",
    `- [Home](${baseUrl}/): Bio, projects, notes, and photography.`,
    `- [About](${baseUrl}/about): Background, work history, and how to reach me.`,
    `- [Projects](${baseUrl}/projects): Open-source projects and developer tools.`,
    `- [Notes](${baseUrl}/notes): Writing on software engineering and architecture.`,
    `- [Nicholas Adamou developer resources](${baseUrl}/developers): Machine-readable guides, markdown negotiation, OpenAPI, and agent entry points.`,
    `- [Contact](${baseUrl}/contact): Get in touch about a project.`,
    `- [Sitemap](${baseUrl}/sitemap.xml): Full list of indexable URLs.`,
    `- [llms.txt](${baseUrl}/llms.txt): Machine-readable guide to this site for AI agents.`,
    "",
  ].join("\n");
}

export function getDevelopersMarkdown(): string {
  const baseUrl = getBaseUrl();

  return [
    "# Nicholas Adamou developer resources",
    "",
    "nicholasadamou developer resources — machine-readable entry points for agents and developers working with Nicholas Adamou's site — open-source projects, technical writing, and content APIs. There is no public product API key, OAuth provider, webhook hub, or MCP server on this host; the surface below is the content and discovery stack.",
    "",
    "## Start here",
    "",
    `- [llms.txt](${baseUrl}/llms.txt): Site map for AI agents — when to use this site, page index, and developer links.`,
    `- [Sitemap](${baseUrl}/sitemap.xml): Full list of indexable URLs.`,
    `- [robots.txt](${baseUrl}/robots.txt): Crawler access rules.`,
    `- [OpenAPI](${baseUrl}/openapi.json): OpenAPI 3.1 description of public agent-facing endpoints.`,
    `- [API catalog](${baseUrl}/.well-known/api-catalog): RFC 9727 linkset pointing at the OpenAPI document.`,
    "",
    "## Content as Markdown",
    "",
    "Request any of the pages below with `Accept: text/markdown` (see https://acceptmarkdown.com). Responses use `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`.",
    "",
    `- [Home](${baseUrl}/)`,
    `- [About](${baseUrl}/about)`,
    `- [Projects](${baseUrl}/projects)`,
    `- [Notes](${baseUrl}/notes)`,
    `- [Contact](${baseUrl}/contact)`,
    `- [Privacy](${baseUrl}/privacy)`,
    `- [Nicholas Adamou developer resources](${baseUrl}/developers)`,
    `- Individual notes at ${baseUrl}/notes/{slug}`,
    "",
    "## Search",
    "",
    `GET ${baseUrl}/api/search?q={query} — JSON search across notes and projects. Returns up to 10 results.`,
    "",
    "## Open-source and writing",
    "",
    `- [Projects](${baseUrl}/projects): Open-source projects and developer tools built by Nicholas Adamou.`,
    `- [Notes](${baseUrl}/notes): Technical writing on software engineering, architecture, and developer tools.`,
    `- [GitHub](https://github.com/nicholasadamou): Source repositories.`,
    "",
    "## What this site is not",
    "",
    "This host does not expose a transactional SaaS API, MCP server, OAuth authorization server, or webhook delivery system. For those capabilities, see the individual open-source projects linked from /projects.",
    "",
  ].join("\n");
}
