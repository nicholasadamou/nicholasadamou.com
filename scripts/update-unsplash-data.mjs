#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to extract Unsplash photo ID from various URL formats
function extractUnsplashPhotoId(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Match various Unsplash URL patterns
  const patterns = [
    // images.unsplash.com and plus.unsplash.com formats
    /(?:images|plus)\.unsplash\.com\/(?:premium_)?photo-([a-zA-Z0-9_-]{10,})/,
    // Standard unsplash.com photo URLs
    /unsplash\.com\/photo-([a-zA-Z0-9_-]+)/,
    /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/,
    // Generic pattern for any 11-character IDs
    /unsplash\.com\/.*\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log(`    Extracted photo ID: ${match[1]}`);
      return match[1];
    }
  }
  
  console.log(`    Could not extract photo ID from URL: ${url}`);
  return null;
}

// Function to fetch photo data from our Unsplash API
async function fetchUnsplashPhotoData(photoId) {
  try {
    const response = await fetch(`http://localhost:3000/api/unsplash?action=get-photo&id=${photoId}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching photo data for ${photoId}:`, error.message);
    return null;
  }
}

// Function to parse MDX frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  // Simple YAML-like parsing (basic implementation)
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let currentValue = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('- ')) {
      // Array item
      if (currentKey) {
        currentValue.push(trimmed.slice(2));
      }
    } else if (line.includes(': ')) {
      // Save previous key-value if exists
      if (currentKey) {
        frontmatter[currentKey] = currentValue.length <= 1 ? currentValue[0] || '' : currentValue;
      }
      
      // Start new key-value
      const colonIndex = line.indexOf(': ');
      currentKey = line.slice(0, colonIndex).trim();
      currentValue = [line.slice(colonIndex + 2).trim().replace(/^["']|["']$/g, '')];
    }
  }
  
  // Don't forget the last key-value pair
  if (currentKey) {
    frontmatter[currentKey] = currentValue.length <= 1 ? currentValue[0] || '' : currentValue;
  }
  
  return { frontmatter, body };
}

// Function to serialize frontmatter back to YAML-like format
function serializeFrontmatter(frontmatter) {
  let result = '';
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      result += `${key}:\n`;
      for (const item of value) {
        result += `  - ${item}\n`;
      }
    } else {
      // Quote values that contain special characters or are URLs
      const needsQuotes = typeof value === 'string' && (
        value.includes(':') || 
        value.includes('#') || 
        value.includes('&') || 
        value.includes('%') ||
        value.includes('?')
      );
      result += `${key}: ${needsQuotes ? `"${value}"` : value}\n`;
    }
  }
  
  return result.trim();
}

// Function to update a single MDX file
async function updateMdxFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Check if this file has an image_url that looks like Unsplash
    const imageUrl = frontmatter.image_url;
    if (!imageUrl || !imageUrl.includes('unsplash.com')) {
      console.log(`  Skipping: No Unsplash image URL found`);
      return;
    }
    
    // Extract photo ID from the URL
    const photoId = extractUnsplashPhotoId(imageUrl);
    if (!photoId) {
      console.log(`  Skipping: Could not extract photo ID from URL`);
      return;
    }
    
    console.log(`  Found photo ID: ${photoId}`);
    
    // Fetch updated data from our API
    const photoData = await fetchUnsplashPhotoData(photoId);
    if (!photoData) {
      console.log(`  Skipping: Could not fetch photo data from API`);
      return;
    }
    
    // Update frontmatter with new data
    const updatedFrontmatter = {
      ...frontmatter,
      image_author: photoData.image_author,
      image_author_url: photoData.image_author_url,
      // Optionally update the image URL to use the optimized version
      // image_url: photoData.optimized_url,
    };
    
    // Serialize the updated content
    const updatedContent = `---\n${serializeFrontmatter(updatedFrontmatter)}\n---\n${body}`;
    
    // Write back to file
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    
    console.log(`  ✅ Updated: ${photoData.image_author} (${photoData.image_author_url})`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to find all MDX files
async function findMdxFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...(await findMdxFiles(fullPath)));
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main function
async function main() {
  console.log('🔍 Finding MDX files with Unsplash images...\n');
  
  const contentDir = path.join(__dirname, '../content');
  const mdxFiles = await findMdxFiles(contentDir);
  
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  // Process each file
  for (const filePath of mdxFiles) {
    await updateMdxFile(filePath);
  }
  
  console.log('\n✨ Done! All MDX files have been processed.');
  console.log('\n📝 Note: Make sure your development server is running on http://localhost:3000');
  console.log('   for the Unsplash API to work properly.');
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
