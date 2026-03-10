import { NextResponse } from "next/server";

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  owner: { login: string };
}

const ACCOUNTS = [
  { type: "users", name: "nicholasadamou" },
  { type: "orgs", name: "dotbrains" },
  { type: "orgs", name: "transmute-games" },
  { type: "orgs", name: "daily-coding-problem" },
  { type: "orgs", name: "youbuildit" },
  { type: "orgs", name: "privydns" },
] as const;

const ORG_NAMES = new Set(
  ACCOUNTS.filter((a) => a.type === "orgs").map((a) => a.name.toLowerCase())
);

async function fetchAllRepos(
  type: "users" | "orgs",
  name: string,
  token: string
): Promise<GitHubRepo[]> {
  let page = 1;
  let allRepos: GitHubRepo[] = [];
  let shouldFetchMore = true;

  while (shouldFetchMore) {
    const response = await fetch(
      `https://api.github.com/${type}/${name}/repos?page=${page}&per_page=100`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) break;

    const repos: GitHubRepo[] = await response.json();
    allRepos = allRepos.concat(repos);

    if (repos.length < 100) {
      shouldFetchMore = false;
    } else {
      page++;
    }
  }

  return allRepos;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GitHub token is not configured" },
      { status: 500 }
    );
  }

  try {
    const results = await Promise.all(
      ACCOUNTS.map(({ type, name }) => fetchAllRepos(type, name, token))
    );

    const allRepos = results.flat();

    // Deduplicate by html_url
    const seen = new Set<string>();
    const unique = allRepos.filter((repo) => {
      if (seen.has(repo.html_url)) return false;
      seen.add(repo.html_url);
      return true;
    });

    const projects = unique.map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      owner: repo.owner.login,
      ownerType: ORG_NAMES.has(repo.owner.login.toLowerCase()) ? "org" : "user",
    }));

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
