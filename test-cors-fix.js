// 🎯 Quick CORS Fix Test
// Copy and paste this in browser console to test

console.log('🔧 Testing CORS fix...');

// Test the CDN endpoint (should work now)
fetch('https://gerattrr.apicdn.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%20%3D%3D%20%22post%22%5D')
  .then(response => {
    console.log('✅ CDN Endpoint Status:', response.status);
    console.log('📡 URL:', response.url);
    return response.json();
  })
  .then(data => {
    console.log('📄 Response:', data);
    console.log('📝 Blog Posts Found:', data.result?.length || 0);
    
    if (data.result?.length === 0) {
      console.log('\n🎉 SUCCESS: API is working! No CORS errors.');
      console.log('💡 Ready to create your first blog post.');
      console.log('🏠 Go to: https://ppnamias.sanity.studio/');
    } else {
      console.log('\n🎉 SUCCESS: Found existing blog posts!');
      data.result.forEach((post, i) => {
        console.log(`${i + 1}. ${post.title || 'Untitled'}`);
      });
    }
  })
  .catch(error => {
    console.error('❌ CORS still not working:', error);
    console.log('\n🔧 Next steps:');
    console.log('1. Add CORS origins manually in Sanity dashboard');
    console.log('2. Check project ID is correct: gerattrr');
  });

console.log('\n🎯 Expected: No CORS errors, API responds with 200 status');
