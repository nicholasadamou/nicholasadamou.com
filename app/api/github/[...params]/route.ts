import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

// Define the Repo interface
interface Repo {
	name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	html_url: string;
}

// Define the schema for user input validation
const addUserSchema = z.object({
	username: z.string(),
	email: z.string().email(),
});

// Retrieve the GitHub token from the environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Throw an error if the GitHub token is not set
if (!GITHUB_TOKEN) {
	throw new Error('GitHub token is not set');
}

// Function to create an Octokit instance
function createOctokitInstance(): Octokit {
	return new Octokit({ auth: GITHUB_TOKEN });
}

// Function to validate the request body for user data
async function validateRequestBody(req: NextRequest) {
	const body = await req.json();
	const parseResult = addUserSchema.safeParse(body);

	if (!parseResult.success) {
		throw new Error(`Invalid input data: ${JSON.stringify(parseResult.error.errors)}`);
	}

	return parseResult.data;
}

// Function to add a user to a repository
async function addUserToRepository(octokit: Octokit, owner: string, repo: string, username: string) {
	const repoDetails = await octokit.repos.get({ owner, repo });
	if (repoDetails.status !== 200) {
		throw new Error(`Repository ${repo} not found`);
	}

	await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
		owner,
		repo,
		username,
		permission: 'pull',
	});
}

// Function to add a user to an organization team and repository
async function addUserToOrgTeamAndRepo(octokit: Octokit, org: string, team: string, repo: string, username: string) {
	await octokit.request('PUT /orgs/{org}/teams/{team}/memberships/{username}', {
		org,
		team,
		username,
		role: 'member',
	});

	await octokit.request('PUT /repos/{org}/{repo}/collaborators/{username}', {
		org,
		repo,
		username,
		permission: 'pull',
	});
}

// GET function to fetch all repositories for a user
export async function GET(req: NextRequest) {
	// Parse the URL to extract the username
	const url = new URL(req.url);
	const pathSegments = url.pathname.split('/').filter(Boolean);
	const username = pathSegments[pathSegments.length - 1]; // Assuming the username is the last segment

	if (!username) {
		return NextResponse.json({ error: 'Invalid path parameters' }, { status: 400 });
	}

	try {
		let page = 1;
		let allRepos: Repo[] = [];
		let shouldFetchMore = true;

		// Fetch all repositories by iterating through pages
		while (shouldFetchMore) {
			const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=100`, {
				headers: {
					Authorization: `token ${GITHUB_TOKEN}`,
					'Accept': 'application/vnd.github.v3+json',  // Set the Accept header for proper API versioning
				},
			});

			// Check for response errors
			if (!response.ok) {
				const errorData = await response.json();  // Get error details from the response
				return NextResponse.json({ error: errorData.message || 'Error fetching repositories from GitHub' }, { status: response.status });
			}

			const repos: Repo[] = await response.json();
			allRepos = allRepos.concat(repos);

			// Stop if we received fewer than 100 repos, which means we're at the end of the list
			if (repos.length < 100) {
				shouldFetchMore = false;
			} else {
				page++;
			}
		}

		// Extract and format the required data
		const projects = allRepos.map((repo) => ({
			name: repo.name,
			description: repo.description,
			language: repo.language,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			url: repo.html_url,
		}));

		// Return all projects
		return NextResponse.json({ projects }, { status: 200 });
	} catch (error) {
		console.error('Error fetching data from GitHub:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

// POST function to add a user to a repository or organization team
export async function POST(req: NextRequest, { params }: { params: { params: string[] } }) {
	const octokit = createOctokitInstance();

	try {
		const { username } = await validateRequestBody(req);
		const pathParams = params.params;

		if (pathParams.length === 2) {
			const [owner, repo] = pathParams;
			await addUserToRepository(octokit, owner, repo, username);
			return NextResponse.json(
				{ message: `User ${username} was successfully added as a collaborator with read-only access to the repository.` },
				{ status: 200 }
			);

		} else if (pathParams.length === 3) {
			const [org, team, repo] = pathParams;
			await addUserToOrgTeamAndRepo(octokit, org, team, repo, username);
			return NextResponse.json(
				{ message: 'User added successfully to the repository with read-only access' },
				{ status: 200 }
			);

		} else {
			return NextResponse.json({ error: 'Invalid path parameters' }, { status: 400 });
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return NextResponse.json({ error: `GitHub API error: ${errorMessage}` }, { status: 500 });
	}
}
