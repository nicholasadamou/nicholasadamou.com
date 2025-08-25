#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Photo ID mapping for existing images that can't be resolved automatically
// You can populate this manually after finding the correct photo IDs
const PHOTO_ID_MAPPING = {
  // Premium photos - add mappings as you find them
  "1678565879444-f87c8bd9f241": {
    correctId: "bKdOqbLRnnA", // Example: found via search
    description: "Premium photo 1 - business related",
    isPremium: true
  },
  "1721476529166-1210b1ca371c": {
    correctId: null, // Replace with actual ID when found  
    description: "Premium photo 2",
    isPremium: true
  },
  // Regular photos
  "1755181023996-348eb11282ef": {
    correctId: null, // Replace with actual ID when found
    description: "Regular photo 1",
    isPremium: false
  },
  "1558494949-ef010cbdcc31": {
    correctId: null, // Replace with actual ID when found
    description: "Regular photo 2", 
    isPremium: false
  }
  // Add more mappings as needed...
};

// Helper function to extract photo ID and handle mapping
function extractAndMapUnsplashPhotoId(url) {
  if (!url || typeof url !== 'string') return null;
  
  // First try the standard extraction for direct photo URLs
  const directImageMatch = url.match(
    /https:\/\/(?:images|plus)\.unsplash\.com\/(?:premium_)?photo-([^?]+)/
  );
  
  if (directImageMatch) {
    const extractedId = directImageMatch[1];
    console.log(`    Extracted timestamp ID: ${extractedId}`);
    
    // Check if we have a mapping for this timestamp ID
    if (PHOTO_ID_MAPPING[extractedId]) {
      const mapping = PHOTO_ID_MAPPING[extractedId];
      if (mapping.correctId) {
        console.log(`    ✅ Found mapping: ${extractedId} -> ${mapping.correctId}`);
        return mapping.correctId;
      } else {
        console.log(`    ⚠️ Mapping exists but needs correct ID to be filled in`);
        return null;
      }
    } else {
      console.log(`    ⚠️ No mapping found for timestamp ID: ${extractedId}`);
      return null;
    }
  }
  
  // Try other URL patterns for standard Unsplash URLs
  const pageUrlMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/[^\/]+-([^\/\?]+)/
  );
  if (pageUrlMatch) {
    console.log(`    Extracted from page URL: ${pageUrlMatch[1]}`);
    return pageUrlMatch[1];
  }
  
  const simplePageMatch = url.match(
    /https:\/\/unsplash\.com\/photos\/([^\/\?]+)/
  );
  if (simplePageMatch) {
    console.log(`    Extracted from simple page URL: ${simplePageMatch[1]}`);
    return simplePageMatch[1];
  }
  
  console.log(`    Could not extract photo ID from URL`);
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

// Function to parse MDX frontmatter (same as before)
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let currentValue = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('- ')) {
      if (currentKey) {
        currentValue.push(trimmed.slice(2));
      }
    } else if (line.includes(': ')) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.length <= 1 ? currentValue[0] || '' : currentValue;
      }
      
      const colonIndex = line.indexOf(': ');
      currentKey = line.slice(0, colonIndex).trim();
      currentValue = [line.slice(colonIndex + 2).trim().replace(/^["']|["']$/g, '')];
    }
  }
  
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
    
    // Extract photo ID from the URL (now with mapping support)
    const photoId = extractAndMapUnsplashPhotoId(imageUrl);
    if (!photoId) {
      console.log(`  Skipping: Could not extract or map photo ID from URL`);
      console.log(`  💡 Consider adding a mapping for this URL in the script`);
      return;
    }
    
    console.log(`  Using photo ID: ${photoId}`);
    
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

// Function to generate a mapping helper for unmapped images
async function generateMappingHelper() {
  console.log('\n📋 MAPPING HELPER:\n');
  
  const unmappedIds = Object.entries(PHOTO_ID_MAPPING)
    .filter(([id, mapping]) => !mapping.correctId)
    .map(([id, mapping]) => ({ id, ...mapping }));
  
  if (unmappedIds.length === 0) {
    console.log('✅ All photo IDs are mapped!');
    return;
  }
  
  console.log(`❌ Found ${unmappedIds.length} unmapped photo ID(s):`);
  
  unmappedIds.forEach((item, index) => {
    console.log(`\n${index + 1}. Timestamp ID: ${item.id}`);
    console.log(`   Type: ${item.isPremium ? 'Premium' : 'Regular'}`);
    console.log(`   Description: ${item.description}`);
    
    if (item.isPremium) {
      console.log(`   Search: curl "http://localhost:3000/api/unsplash?action=search&query=premium+business&per_page=10"`);
    } else {
      console.log(`   Search: curl "http://localhost:3000/api/unsplash?action=search&query=professional&per_page=10"`);
    }
    
    console.log(`   Random: curl "http://localhost:3000/api/unsplash?action=random&count=5"`);
    console.log(`   Test ID: curl "http://localhost:3000/api/unsplash?action=get-photo&id=PHOTO_ID"`);
  });
  
  console.log(`\n💡 To add mappings:`);
  console.log(`1. Use the search/random endpoints above to find your photos`);
  console.log(`2. Update the PHOTO_ID_MAPPING object in this script`);
  console.log(`3. Replace null values with the correct photo IDs`);
  console.log(`4. Re-run the script to update your MDX files`);
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
  
  // First, show the mapping status
  await generateMappingHelper();
  
  const contentDir = path.join(__dirname, '../content');
  const mdxFiles = await findMdxFiles(contentDir);
  
  console.log(`\nFound ${mdxFiles.length} MDX files\n`);
  
  // Process each file
  for (const filePath of mdxFiles) {
    await updateMdxFile(filePath);
  }
  
  console.log('\n✨ Done! All MDX files have been processed.');
  console.log('\n📝 Notes:');
  console.log('- Files with unmapped photo IDs were skipped');
  console.log('- Add mappings to PHOTO_ID_MAPPING and re-run to process them');
  console.log('- Make sure your development server is running on http://localhost:3000');
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
