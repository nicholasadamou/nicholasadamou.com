#!/usr/bin/env node

/**
 * Spotify Refresh Token Helper
 *
 * Usage:
 *   node scripts/setup/spotify-token.js
 *
 * Prerequisites:
 *   Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
 *
 * This starts a local server, opens the Spotify auth page in your browser,
 * and exchanges the callback code for a refresh token.
 */

import http from "node:http";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2]
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
}

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 3456;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local"
  );
  process.exit(1);
}

const authUrl =
  `https://accounts.spotify.com/authorize?` +
  `client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    res.writeHead(400);
    res.end(`Authorization failed: ${error || "no code returned"}`);
    server.close();
    process.exit(1);
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (!data.refresh_token) {
      console.error("Failed to get refresh token:", data);
      res.writeHead(500);
      res.end("Failed to get refresh token. Check console.");
      server.close();
      process.exit(1);
    }

    console.log("\n✅ Got refresh token!\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    console.log(
      "Add this to your .env.local and Vercel environment variables.\n"
    );

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<html><body style="font-family:system-ui;padding:2rem">` +
        `<h2>✅ Got your Spotify refresh token!</h2>` +
        `<p>Check your terminal for the token. You can close this tab.</p>` +
        `</body></html>`
    );

    server.close();
    process.exit(0);
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.writeHead(500);
    res.end("Token exchange failed. Check console.");
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`\nListening on http://localhost:${PORT}`);
  console.log("Opening Spotify authorization page...\n");

  // Open browser (macOS)
  try {
    execSync(`open "${authUrl}"`);
  } catch {
    console.log(`Open this URL in your browser:\n${authUrl}\n`);
  }
});
