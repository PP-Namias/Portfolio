// Test Skills Data Configuration
import { skillsDatabase, getSkillStats, getTrendingSkills } from "./src/data/skillsConfig.ts";

console.log("=== Skills Configuration Test ===\n");

// Test basic data structure
console.log("📊 Skill Statistics:");
const stats = getSkillStats();
console.log(`- Total Skills: ${stats.totalSkills}`);
console.log(`- Average Level: ${stats.averageLevel}%`);
console.log(`- Expert Level (90+): ${stats.expertLevel}`);
console.log(`- Advanced Level (80+): ${stats.advancedLevel}`);
console.log(`- Total Projects: ${stats.totalProjects}`);
console.log(`- Categories: ${stats.categoriesCount}`);
console.log(`- Recent Updates: ${stats.recentUpdates}\n`);

// Test categories
console.log("📁 Categories:");
Object.entries(skillsDatabase).forEach(([key, skills]) => {
  console.log(`- ${key}: ${skills.length} skills`);
});
console.log("");

// Test trending skills
console.log("🔥 Trending Skills:");
const trendingSkills = getTrendingSkills();
trendingSkills.forEach(skill => {
  console.log(`- ${skill.name} (${skill.level}%) - ${skill.experience}`);
});
console.log("");

// Test frontend skills detail
console.log("💻 Frontend Skills Detail:");
skillsDatabase.frontend.forEach(skill => {
  console.log(`- ${skill.name}: Level ${skill.level}%, ${skill.projects.length} projects`);
});

console.log("\n✅ All tests completed successfully!");