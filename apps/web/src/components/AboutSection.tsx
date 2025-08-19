import { Mail, Phone, MapPin } from "lucide-react";

export default function AboutSection() {
  const skills = [
    { name: "Frontend Development", level: 86 },
    { name: "Backend Development", level: 89 },
    { name: "AI & Automation", level: 85 },
    { name: "Database Management", level: 90 },
    { name: "DevOps & Deployment", level: 92 },
    { name: "UI/UX Design", level: 87 },
  ];

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            About Me
          </h2>
          <p className="text-xl text-gray-400">
            Get to know more about my journey and expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="scroll-fade-in">
            <h3 className="text-3xl font-bold mb-6">
              About Me
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              I'm a passionate developer
              specializing in AI automation, chatbot development, and full-stack
              web applications. My expertise spans across React, Node.js,
              TypeScript, and modern AI platforms for web development.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Currently working with cutting-edge technologies like n8n, Twilio,
              ElevenLabs, and ChatGPT to create intelligent automation solutions.
              I've led teams in developing CRM systems, AI agents, and
              company-trained chatbots that optimize workflows and improve
              efficiency.
            </p>
          </div>

          <div className="scroll-fade-in">
            {/* Skills */}
            <div className="glassmorphism rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text">
                Core Skills
              </h4>
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-blue-400 font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
