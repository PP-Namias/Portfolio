import { Code, Database, Cloud, Palette, Brain, CreditCard, Wrench } from "lucide-react";

export default function TechnicalSkillsSection() {
  const skillCategories = [
    {
      title: "Frontend (Client-Side)",
      icon: <Code className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-blue-500 to-cyan-500",
      skills: [
        "HTML, CSS, JavaScript, TypeScript",
        "React, Vue.js (Learning), Next.js (Learning)",
        "Tailwind CSS, CSS Modules",
        "Redux",
        "Vite, Webpack"
      ]
    },
    {
      title: "Backend (Server-Side)",
      icon: <Database className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-green-500 to-emerald-500",
      skills: [
        "JavaScript, TypeScript",
        "Express.js, Node.js",
        "RESTful APIs",
        "JWT, OAuth, Passport.js, Auth0",
        "JSON – request/response handling, structuring"
      ]
    },
    {
      title: "Databases",
      icon: <Database className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-purple-500 to-pink-500",
      skills: [
        "PostgreSQL, MySQL, SQLite",
        "MongoDB"
      ]
    },
    {
      title: "DevOps / Hosting / Deployment",
      icon: <Cloud className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-orange-500 to-red-500",
      skills: [
        "Vercel, Railway",
        "Git, GitHub, GitHub Actions",
        ".env, dotenv"
      ]
    },
    {
      title: "UI/UX Design & CMS",
      icon: <Palette className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-pink-500 to-rose-500",
      skills: [
        "Figma, Wireframing, Prototyping",
        "WordPress (Elementor), Sanity",
        "Shopify (Learning)"
      ]
    },
    {
      title: "AI & Automation",
      icon: <Brain className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-indigo-500 to-purple-500",
      skills: [
        "OpenAI (API usage, fine-tuning), Gemini, Claude",
        "Whisper (via Hugging Face) – built a custom transcription tool",
        "GitHub Copilot",
        "n8n, Twilio",
        "Prompt engineering, dataset formatting, API orchestration"
      ]
    },
    {
      title: "Payments & Integration",
      icon: <CreditCard className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-teal-500 to-cyan-500",
      skills: [
        "Xendit – invoicing and payment integration"
      ]
    },
    {
      title: "Developer Tools",
      icon: <Wrench className="h-6 w-6" />,
      level: "Intermediate",
      color: "from-yellow-500 to-orange-500",
      skills: [
        "Postman",
        "JSON formatting and manipulation"
      ]
    }
  ];

  return (
    <section id="technical-skills" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise across different domains of software development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className="scroll-fade-in glassmorphism rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${category.color}`}>
                      {category.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  </div>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} mt-2 flex-shrink-0`}></div>
                      <span className="text-gray-300 text-sm leading-relaxed">
                        {skill.includes("(Learning)") ? (
                          <>
                            {skill.replace(" (Learning)", "")}
                            <span className="ml-2 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                              Learning
                            </span>
                          </>
                        ) : (
                          skill
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-16 scroll-fade-in">
          <div className="glassmorphism rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center gradient-text">
              Skills Summary
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">8</div>
                <div className="text-gray-400">Skill Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">25+</div>
                <div className="text-gray-400">Technologies</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">3+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-400">Intermediate</div>
                <div className="text-gray-400">Overall Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
