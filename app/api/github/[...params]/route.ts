import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const addUserSchema = z.object({
	username: z.string(),
	email: z.string().email(),
});

const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
	throw new Error('GitHub token is not set');
}

function createOctokitInstance(): Octokit {
	return new Octokit({ auth: GITHUB_TOKEN });
}

async function validateRequestBody(req: NextRequest) {
	const body = await req.json();
	const parseResult = addUserSchema.safeParse(body);

	if (!parseResult.success) {
		throw new Error(`Invalid input data: ${JSON.stringify(parseResult.error.errors)}`);
	}

	return parseResult.data;
}

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
