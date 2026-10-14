import { clients, services, processSteps } from "@/lib/content/clients";
import { getAllArticles, getArticleBySlug } from "@/lib/content/mdx";
import { projects } from "@/lib/projects/config";
import {
  connectLinks,
  credentials,
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
    "Hi, I'm Nick, a senior outcome engineer at [Onebrief](https://www.onebrief.com).",
    "",
    "I'm a senior outcome engineer who's worked at companies including [IBM](https://www.ibm.com), [Lockheed Martin, Space](https://www.lockheedmartin.com), [Apple](https://www.apple.com), and [Fly Blackbird (acquired by SurfAir)](https://www.surfair.com).",
    "",
    "I hold a [Master of Science in Computer Science](https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e) from [Georgia Institute of Technology](https://www.gatech.edu) and a [Bachelor of Arts in Computer Science](https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing) from [Cornell College](https://www.cornellcollege.edu). I'm passionate about making the world better through software.",
    "",
    `More about me: ${baseUrl}/about`,
    "",
    "## Client work",
    "",
    ...clients.map(
      (client) => `- [${client.name}](${client.href}): ${client.description}`
    ),
    `[Explore client work](${baseUrl}/clients)`,
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
    "I am a seasoned Senior Outcome Engineer with a strong academic foundation, holding a [Master of Science in Computer Science](https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e) from [Georgia Institute of Technology](https://www.gatech.edu) and a [Bachelor of Arts in Computer Science](https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing) from [Cornell College](https://www.cornellcollege.edu). My career is marked by a commitment to leveraging software engineering to create meaningful impact. I am a strong advocate for user-centered design and am passionate about creating well-designed products that are intuitive and easy to use.",
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
    "# Tell me what you’re working toward",
    "",
    "A new website, a fresh direction, or software that makes your work easier. Share a little context so we can have a useful first conversation.",
    "",
    "I usually reply within a couple of days.",
    "",
    "## Project intake",
    "",
    "Required: name, email, project type, timeframe, and a 20–5,000 character project brief.",
    "",
    "Optional: business or organization, current website, and an approximate budget with currency. A budget is not a quote or commitment.",
    "",
    "Describe your audience, goals, features, and any existing content or designs. Do not include passwords or sensitive personal information.",
    "",
    `[Submit your project brief](${baseUrl}/contact). Your details are used to respond to your inquiry; see the [privacy policy](${baseUrl}/privacy).`,
    "",
    `[Explore client work](${baseUrl}/clients)`,
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

export function getClientsMarkdown(): string {
  return [
    "# Client work",
    "",
    "Selected websites built by Nicholas Adamou.",
    "",
    ...clients.flatMap((client) => [
      `## ${client.name}`,
      "",
      client.description,
      "",
      `[Visit ${client.name}](${client.href})`,
      "",
      `![${client.name} homepage](${getBaseUrl()}/images/clients/${client.slug}.webp)`,
      "",
    ]),
    "## How I can help",
    "",
    ...services.flatMap((s) => [`### ${s.title}`, "", s.description, ""]),
    "## Working together",
    "",
    ...processSteps.flatMap((s) => [`### ${s.title}`, "", s.description, ""]),
    `[Discuss your project](${getBaseUrl()}/contact)`,
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
    "nicholasadamou developer resources — machine-readable entry points for agents and developers working with Nicholas Adamou's site: versioned content API, OpenAPI, MCP server, official CLI, Markdown negotiation, and discovery files. The public surface is read-only and requires no API key or OAuth.",
    "",
    "## Start here",
    "",
    `- [llms.txt](${baseUrl}/llms.txt): Site map for AI agents — when to use this site, page index, and developer links.`,
    `- [Sitemap](${baseUrl}/sitemap.xml): Full list of indexable URLs.`,
    `- [robots.txt](${baseUrl}/robots.txt): Crawler access rules.`,
    `- [OpenAPI](${baseUrl}/openapi.json): OpenAPI 3.1 description of the public /api/v1 content API.`,
    `- [API catalog](${baseUrl}/.well-known/api-catalog): RFC 9727 linkset pointing at the OpenAPI document.`,
    "",
    "## Public content API",
    "",
    "Stable REST operations use URL path versioning under `/api/v1`. All documented JSON endpoints are read-only.",
    "",
    `- \`GET ${baseUrl}/api/v1/search?q={query}\` — search notes and projects (up to 10 results).`,
    `- \`GET ${baseUrl}/api/v1/notes\` — list notes.`,
    `- \`GET ${baseUrl}/api/v1/notes/{slug}\` — get one note including Markdown body.`,
    `- \`GET ${baseUrl}/api/v1/projects\` — list projects.`,
    "",
    `The unversioned \`${baseUrl}/api/search\` route remains as a deprecated compatibility alias with RFC 9745 \`Deprecation\` and \`Sunset\` headers. Prefer \`/api/v1/search\`.`,
    "",
    "## Errors",
    "",
    "Public `/api/v1` errors use RFC 9457 `application/problem+json` with a stable `code`, human-readable `detail`, and a concrete `resolution` hint. Unknown `/api/v1` routes and unsupported methods return the same shape instead of an HTML error page.",
    "",
    "- `invalid_query` · 400 — Pass the documented query parameter (for example `q`).",
    "- `note_not_found` · 404 — List notes or search, then retry with a valid slug.",
    "- `method_not_allowed` · 405 — Use GET on read-only endpoints.",
    "- `api_route_not_found` · 404 — Recover via OpenAPI or the API catalog.",
    "- `internal_error` · 500 — Retry shortly; do not invent alternate endpoints.",
    "",
    "## Versioning and deprecation",
    "",
    "Stable REST operations use a major version in the URL, beginning with `/api/v1`. Backward-compatible fields may be added within v1; breaking request or response changes require a new major path. Before removing a stable version, this site will publish guidance on /developers and signal deprecation with RFC 9745 `Deprecation` and `Link` headers. A dated `Sunset` header will be announced at least 90 days before removal.",
    "",
    "## CLI",
    "",
    "Official npm package [`nicholasadamou`](https://www.npmjs.com/package/nicholasadamou):",
    "",
    "```",
    "npx nicholasadamou search <query>",
    "npx nicholasadamou notes",
    "npx nicholasadamou note <slug>",
    "npx nicholasadamou projects",
    "npx nicholasadamou docs",
    "```",
    "",
    "Add `--json` for the unchanged API response and structured problem+json errors.",
    "",
    "## MCP server",
    "",
    `Connect a Streamable HTTP MCP client to ${baseUrl}/mcp. Read-only tools: \`nicholasadamou_search\`, \`nicholasadamou_list_notes\`, \`nicholasadamou_get_note\`, \`nicholasadamou_list_projects\`, \`nicholasadamou_get_developer_docs\`.`,
    "",
    `- [MCP registry manifest](${baseUrl}/server.json)`,
    `- [MCP server card](${baseUrl}/mcp/server-card) (also ${baseUrl}/.well-known/mcp and ${baseUrl}/.well-known/mcp/server-card.json)`,
    `- [AI Catalog](${baseUrl}/.well-known/ai-catalog.json)`,
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
    "## Open-source and writing",
    "",
    `- [Projects](${baseUrl}/projects): Open-source projects and developer tools built by Nicholas Adamou.`,
    `- [Notes](${baseUrl}/notes): Technical writing on software engineering, architecture, and developer tools.`,
    `- [GitHub](https://github.com/nicholasadamou): Source repositories.`,
    "",
    "## Authentication and writes",
    "",
    "The documented JSON API, CLI, and MCP tools are public and read-only. They require no API key or OAuth flow and do not provide writes, webhooks, or event subscriptions.",
    "",
  ].join("\n");
}
