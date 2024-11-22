import { NextResponse } from 'next/server';

export async function GET() {
	const GITHUB_USERNAME = 'nicholasadamou';
	const REPO_NAME = 'nicholasadamou.com';
	const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

	// Check if the GitHub token is provided
	if (!GITHUB_TOKEN) {
		return NextResponse.json({ error: 'GitHub token not provided' }, { status: 500 });
	}

	try {
		// Fetch the latest commit for the main branch
		const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/commits/main`, {
			headers: {
				Authorization: `Bearer ${GITHUB_TOKEN}`,
				Accept: 'application/vnd.github.v3+json',
			},
		});

		// Check for response errors
		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json({ error: errorData.message || 'Error fetching latest commit from GitHub' }, { status: response.status });
		}

		const commitData = await response.json();
		const commitHash = commitData.sha;

		// Return the latest commit hash
		return NextResponse.json({ commitHash }, { status: 200 });
	} catch (error) {
		console.error('Error fetching data from GitHub:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
