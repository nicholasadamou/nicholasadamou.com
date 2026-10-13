const DEFAULT_BASE = "https://nicholasadamou.com";

function printHelp() {
  console.log(`Nicholas Adamou developer CLI

Usage:
  nicholasadamou search <query> [--json]
  nicholasadamou notes [--json]
  nicholasadamou note <slug> [--json]
  nicholasadamou projects [--json]
  nicholasadamou docs [--json]
  nicholasadamou --help
  nicholasadamou --version

Environment:
  NICHOLASADAMOU_BASE_URL  Override API host (default: ${DEFAULT_BASE})
`);
}

function baseUrl() {
  return (process.env.NICHOLASADAMOU_BASE_URL || DEFAULT_BASE).replace(
    /\/$/,
    ""
  );
}

async function apiGet(path) {
  const url = `${baseUrl()}${path}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json, application/problem+json" },
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { detail: text };
  }

  if (!response.ok) {
    const err = new Error(
      body?.detail || body?.title || `HTTP ${response.status} for ${url}`
    );
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function printSearch(body) {
  if (!body.results?.length) {
    console.log("No results.");
    return;
  }
  for (const item of body.results) {
    console.log(`[${item.type}] ${item.title}`);
    console.log(`  ${item.url || item.href}`);
    if (item.summary) console.log(`  ${item.summary}`);
    console.log("");
  }
}

function printNotes(body) {
  for (const note of body.notes ?? []) {
    console.log(`${note.title} (${note.slug})`);
    console.log(`  ${note.url}`);
    console.log(`  ${note.summary}`);
    console.log("");
  }
}

function printProjects(body) {
  for (const project of body.projects ?? []) {
    console.log(project.name);
    console.log(`  ${project.href}`);
    console.log(`  ${project.description}`);
    if (project.tags?.length) console.log(`  tags: ${project.tags.join(", ")}`);
    console.log("");
  }
}

export async function main(argv) {
  const json = argv.includes("--json");
  const args = argv.filter((a) => a !== "--json");
  const command = args[0];

  if (
    !command ||
    command === "--help" ||
    command === "-h" ||
    command === "help"
  ) {
    printHelp();
    return;
  }

  if (command === "--version" || command === "-v" || command === "version") {
    console.log("2.0.0");
    return;
  }

  try {
    if (command === "search") {
      const query = args.slice(1).join(" ").trim();
      if (!query) {
        printHelp();
        process.exitCode = 1;
        return;
      }
      const body = await apiGet(
        `/api/v1/search?q=${encodeURIComponent(query)}`
      );
      if (json) printJson(body);
      else printSearch(body);
      return;
    }

    if (command === "notes") {
      const body = await apiGet("/api/v1/notes");
      if (json) printJson(body);
      else printNotes(body);
      return;
    }

    if (command === "note") {
      const slug = args[1];
      if (!slug) {
        printHelp();
        process.exitCode = 1;
        return;
      }
      const body = await apiGet(`/api/v1/notes/${encodeURIComponent(slug)}`);
      if (json) printJson(body);
      else {
        console.log(body.title);
        console.log(body.url);
        console.log("");
        console.log(body.body);
      }
      return;
    }

    if (command === "projects") {
      const body = await apiGet("/api/v1/projects");
      if (json) printJson(body);
      else printProjects(body);
      return;
    }

    if (command === "docs") {
      const response = await fetch(`${baseUrl()}/developers`, {
        headers: { Accept: "text/markdown" },
      });
      const markdown = await response.text();
      if (json) {
        printJson({
          title: "Nicholas Adamou developer resources",
          url: `${baseUrl()}/developers`,
          markdown,
        });
      } else {
        console.log(markdown);
      }
      return;
    }

    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exitCode = 1;
  } catch (error) {
    if (json && error.body) {
      printJson(error.body);
    } else {
      console.error(error.message);
    }
    process.exitCode = typeof error.status === "number" ? 1 : 1;
  }
}
