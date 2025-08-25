#!/usr/bin/env node

import fs from 'fs/promises';

// Test if we can find the actual photo ID by searching for similar images
async function reverseUnsplashLookup(imageUrl) {
  console.log(`\nTesting reverse lookup for: ${imageUrl}`);
  
  // Extract the timestamp ID
  const timestampMatch = imageUrl.match(/(?:premium_)?photo-([0-9-a-f]+)/);
  if (!timestampMatch) {
    console.log('❌ Could not extract timestamp ID from URL');
    return null;
  }
  
  const timestampId = timestampMatch[1];
  console.log(`📝 Extracted timestamp ID: ${timestampId}`);
  
  // Try different approaches to find the actual photo
  const approaches = [
    // Approach 1: Try searching for the image by checking if the timestamp format has patterns
    async () => {
      // Some images might have the actual ID embedded in the timestamp
      const parts = timestampId.split('-');
      if (parts.length >= 2) {
        const possibleId = parts[parts.length - 1];
        if (possibleId.length >= 10) {
          console.log(`🔍 Trying potential ID from timestamp: ${possibleId}`);
          return await testPhotoId(possibleId);
        }
      }
      return null;
    },
    
    // Approach 2: Search by visual characteristics (width/height from URL params)
    async () => {
      const urlObj = new URL(imageUrl);
      const width = urlObj.searchParams.get('w');
      const height = urlObj.searchParams.get('h');
      
      if (width) {
        console.log(`🔍 Searching by dimensions: ${width}x${height || 'auto'}`);
        // This would require implementing a search by dimensions
        // For now, we'll try a general search approach
        return null;
      }
      return null;
    }
  ];
  
  for (const approach of approaches) {
    try {
      const result = await approach();
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(`⚠️ Approach failed: ${error.message}`);
    }
  }
  
  console.log('❌ Could not find matching photo ID through reverse lookup');
  return null;
}

async function testPhotoId(photoId) {
  try {
    console.log(`  Testing photo ID: ${photoId}`);
    const response = await fetch(`http://localhost:3000/api/unsplash?action=get-photo&id=${photoId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Found valid photo: ${data.image_author} - "${data.description}"`);
      return {
        id: photoId,
        author: data.image_author,
        authorUrl: data.image_author_url,
        description: data.description
      };
    } else {
      console.log(`  ❌ Photo ID ${photoId} not found (${response.status})`);
      return null;
    }
  } catch (error) {
    console.log(`  ❌ Error testing photo ID ${photoId}: ${error.message}`);
    return null;
  }
}

// Test URLs from your content
const testUrls = [
  "https://plus.unsplash.com/premium_photo-1678565879444-f87c8bd9f241?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1721476529166-1210b1ca371c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1755181023996-348eb11282ef?ixlib=rb-4.1.0%5C&w=1200&q=80&auto=format&fit=crop"
];

async function main() {
  console.log('🔍 Testing reverse lookup for premium Unsplash URLs...\n');
  
  for (const url of testUrls) {
    const result = await reverseUnsplashLookup(url);
    
    if (result) {
      console.log(`\n✅ SUCCESS for ${url}`);
      console.log(`   Photo ID: ${result.id}`);
      console.log(`   Author: ${result.author}`);
      console.log(`   Author URL: ${result.authorUrl}`);
      console.log(`   Description: ${result.description}`);
    } else {
      console.log(`\n❌ FAILED for ${url}`);
    }
    
    console.log('\n' + '='.repeat(80));
  }
}

main().catch(console.error);
