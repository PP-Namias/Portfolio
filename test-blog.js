// 🧪 Sanity Blog Test Script
// Open browser console (F12) and paste this to test blog functionality

console.log('🔍 Testing PP Namias Blog Integration...');

// Test your Sanity connection
const testQuery = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  published,
  _createdAt,
  author->{
    name
  }
}`;

fetch(`https://gerattrr.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(testQuery)}`)
  .then(response => {
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API URL:', response.url);
    return response.json();
  })
  .then(data => {
    console.log('\n✅ Blog Data Response:', data);
    
    if (data.result && Array.isArray(data.result)) {
      console.log('\n📄 Blog Posts Found:', data.result.length);
      
      if (data.result.length > 0) {
        console.log('\n📝 Blog Posts:');
        data.result.forEach((post, index) => {
          console.log(`${index + 1}. ${post.title || 'Untitled'}`);
          console.log(`   - Published: ${post.published ? 'Yes' : 'No'}`);
          console.log(`   - Author: ${post.author?.name || 'No author'}`);
          console.log(`   - Created: ${post._createdAt}`);
          console.log('');
        });
        
        console.log('🎉 SUCCESS: Blog posts are loading correctly!');
      } else {
        console.log('\n⚠️  No blog posts found in your CMS');
        console.log('💡 Next steps:');
        console.log('1. Go to https://ppnamias.sanity.studio/');
        console.log('2. Create an author profile');
        console.log('3. Create categories');
        console.log('4. Create your first blog post');
        console.log('5. Set "Published" to true');
      }
    } else {
      console.log('\n❌ Unexpected response format');
      console.log('Response:', data);
    }
  })
  .catch(error => {
    console.error('\n❌ Error fetching blog posts:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Sanity studio is accessible');
    console.log('2. Verify project ID (should be: gerattrr)');
    console.log('3. Check CORS settings');
    console.log('4. Ensure you have blog posts published');
  });

console.log('\n🎯 Expected API endpoint: https://gerattrr.api.sanity.io/');
console.log('🏠 Your CMS: https://ppnamias.sanity.studio/');
console.log('💻 Your portfolio: http://localhost:5173/');

// Test author and category creation readiness
setTimeout(() => {
  console.log('\n🔧 Testing schema readiness...');
  
  // Test authors
  fetch(`https://gerattrr.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent('*[_type == "author"]')}`)
    .then(res => res.json())
    .then(data => {
      console.log(`👤 Authors found: ${data.result?.length || 0}`);
      if (data.result?.length === 0) {
        console.log('💡 Create an author profile first!');
      }
    });
  
  // Test categories  
  fetch(`https://gerattrr.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent('*[_type == "category"]')}`)
    .then(res => res.json())
    .then(data => {
      console.log(`🏷️  Categories found: ${data.result?.length || 0}`);
      if (data.result?.length === 0) {
        console.log('💡 Create categories for better organization!');
      }
    });
}, 1000);
