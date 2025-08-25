#!/usr/bin/env node

// Alternative approach: Create a mapping service for your existing images
// This can help you find the correct photo IDs for your existing content

async function analyzeImageUrl(imageUrl) {
  console.log(`\nAnalyzing: ${imageUrl}`);
  
  try {
    // Extract useful information from the URL
    const urlObj = new URL(imageUrl);
    const isPremium = imageUrl.includes('plus.unsplash.com') || imageUrl.includes('premium_photo');
    const width = urlObj.searchParams.get('w');
    const height = urlObj.searchParams.get('h');
    
    console.log(`   Type: ${isPremium ? 'Premium' : 'Regular'}`);
    console.log(`   Dimensions: ${width || 'auto'}x${height || 'auto'}`);
    
    // Extract the timestamp ID for reference
    const timestampMatch = imageUrl.match(/(?:premium_)?photo-([0-9-a-f]+)/);
    const timestampId = timestampMatch ? timestampMatch[1] : 'unknown';
    console.log(`   Timestamp ID: ${timestampId}`);
    
    return {
      url: imageUrl,
      isPremium,
      width: width || null,
      height: height || null,
      timestampId,
      needsMapping: true
    };
    
  } catch (error) {
    console.log(`   ❌ Error analyzing URL: ${error.message}`);
    return null;
  }
}

// This function provides you with search strategies to manually find the correct photo IDs
async function suggestSearchStrategies(analysis) {
  console.log(`\n💡 Search strategies for ${analysis.timestampId}:`);
  
  const strategies = [];
  
  // Strategy 1: Search by dimensions if available
  if (analysis.width && parseInt(analysis.width) > 1000) {
    const searchQuery = analysis.isPremium ? 'premium business professional' : 'high resolution';
    strategies.push({
      method: 'Search by type and quality',
      query: searchQuery,
      apiCall: `GET /api/unsplash?action=search&query=${encodeURIComponent(searchQuery)}&per_page=20`
    });
  }
  
  // Strategy 2: Search for premium content specifically
  if (analysis.isPremium) {
    strategies.push({
      method: 'Search premium content',
      query: 'professional premium stock',
      apiCall: `GET /api/unsplash?action=search&query=professional+premium+stock&per_page=30`
    });
  }
  
  // Strategy 3: Random with filters
  strategies.push({
    method: 'Random search with filters',
    query: analysis.isPremium ? 'premium quality' : 'high quality',
    apiCall: `GET /api/unsplash?action=random&count=10&query=${encodeURIComponent(analysis.isPremium ? 'premium quality' : 'high quality')}`
  });
  
  // Display strategies
  strategies.forEach((strategy, index) => {
    console.log(`   ${index + 1}. ${strategy.method}:`);
    console.log(`      Query: "${strategy.query}"`);
    console.log(`      API: ${strategy.apiCall}`);
    console.log(`      Test: curl "http://localhost:3000${strategy.apiCall}"`);
    console.log('');
  });
  
  return strategies;
}

// Generate a manual mapping template
async function generateMappingTemplate(analyses) {
  console.log('\n📝 MANUAL MAPPING TEMPLATE:');
  console.log('Copy this template and fill in the correct photo IDs after searching:\n');
  
  const template = {
    note: "Manual mapping from timestamp IDs to actual Unsplash photo IDs",
    instructions: [
      "1. Use the search strategies above to find the correct photos",
      "2. Replace 'REPLACE_WITH_ACTUAL_ID' with the real photo ID",
      "3. The photo ID should be the short format like 'Bd7gNnWJBkU'",
      "4. Test each ID: curl 'http://localhost:3000/api/unsplash?action=get-photo&id=PHOTO_ID'"
    ],
    mappings: {}
  };
  
  analyses.forEach(analysis => {
    if (analysis) {
      template.mappings[analysis.timestampId] = {
        originalUrl: analysis.url,
        isPremium: analysis.isPremium,
        dimensions: `${analysis.width || 'auto'}x${analysis.height || 'auto'}`,
        correctPhotoId: 'REPLACE_WITH_ACTUAL_ID',
        status: 'NEEDS_MANUAL_LOOKUP'
      };
    }
  });
  
  console.log(JSON.stringify(template, null, 2));
  
  // Also save to file for easy editing
  const fs = await import('fs/promises');
  await fs.writeFile('unsplash-mapping-template.json', JSON.stringify(template, null, 2));
  console.log('\n💾 Template saved to: unsplash-mapping-template.json');
  
  return template;
}

// Test URLs from your content
const testUrls = [
  "https://plus.unsplash.com/premium_photo-1678565879444-f87c8bd9f241?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1721476529166-1210b1ca371c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1755181023996-348eb11282ef?ixlib=rb-4.1.0%5C&w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

async function main() {
  console.log('🔍 Analyzing Unsplash URLs and generating search strategies...\n');
  
  const analyses = [];
  
  for (const url of testUrls) {
    const analysis = await analyzeImageUrl(url);
    if (analysis) {
      analyses.push(analysis);
      await suggestSearchStrategies(analysis);
      console.log('─'.repeat(80));
    }
  }
  
  // Generate the mapping template
  await generateMappingTemplate(analyses);
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Use the search strategies above to find your photos');
  console.log('2. Fill in the mapping template with correct photo IDs');
  console.log('3. Create a more advanced update script using the mappings');
  console.log('4. For future content, use the API search to get correct IDs from the start');
}

main().catch(console.error);
