#!/usr/bin/env node

// Script to check Unsplash account status and premium access
async function checkUnsplashAccount() {
  console.log('🔍 Checking Unsplash account status...\n');
  
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const secretKey = process.env.UNSPLASH_SECRET_KEY;
  
  if (!accessKey) {
    console.log('❌ UNSPLASH_ACCESS_KEY is not set');
    return;
  }
  
  if (!secretKey) {
    console.log('❌ UNSPLASH_SECRET_KEY is not set');
    return;
  }
  
  console.log('✅ Environment variables are set');
  console.log(`   Access Key: ${accessKey.substring(0, 8)}...`);
  console.log(`   Secret Key: ${secretKey.substring(0, 8)}...\n`);
  
  try {
    // Check account status via our API
    console.log('📊 Testing API access...');
    
    const testResponse = await fetch('http://localhost:3000/api/unsplash?action=search&query=premium&per_page=1');
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✅ API is working');
      console.log(`   Found ${data.results?.length || 0} result(s)\n`);
      
      if (data.results?.[0]) {
        const photo = data.results[0];
        console.log('📸 Sample photo:');
        console.log(`   ID: ${photo.id}`);
        console.log(`   Author: ${photo.image_author}`);
        console.log(`   URLs available: ${Object.keys(photo.urls).join(', ')}`);
        console.log(`   Raw URL: ${photo.urls.raw}`);
        console.log();
      }
    } else {
      console.log(`❌ API error: ${testResponse.status}`);
    }
    
    // Check if we can access premium content specifically
    console.log('🔒 Testing premium content access...');
    
    const premiumResponse = await fetch('http://localhost:3000/api/unsplash?action=random&count=1&query=premium');
    
    if (premiumResponse.ok) {
      const premiumData = await premiumResponse.json();
      console.log('✅ Premium content accessible');
      
      if (premiumData.results?.[0]) {
        const premiumPhoto = premiumData.results[0];
        console.log(`   Premium photo ID: ${premiumPhoto.id}`);
        console.log(`   Raw URL: ${premiumPhoto.urls.raw}`);
        
        // Check if the raw URL contains premium indicators
        if (premiumPhoto.urls.raw.includes('plus.unsplash.com') || premiumPhoto.urls.raw.includes('premium')) {
          console.log('   ✅ This appears to be premium content');
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n💡 Watermark Troubleshooting:');
  console.log('1. Watermarks appear when:');
  console.log('   - Using free Unsplash plan with premium images');
  console.log('   - Images are accessed without proper authentication');
  console.log('   - Using demo/development keys instead of production keys');
  console.log();
  console.log('2. To remove watermarks:');
  console.log('   - Ensure you have an Unsplash+ subscription');
  console.log('   - Use production API keys (not demo keys)');
  console.log('   - Access images through authenticated API calls');
  console.log('   - Consider using non-premium alternatives');
  console.log();
  console.log('3. Check your plan at: https://unsplash.com/account');
}

// Check if we're in a Node.js environment with proper setup
if (typeof process !== 'undefined' && process.env) {
  checkUnsplashAccount().catch(console.error);
} else {
  console.log('❌ This script must be run in a Node.js environment with access to environment variables');
}
