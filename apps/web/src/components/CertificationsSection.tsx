import { Award, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function CertificationsSection() {
  const [showAllSkills, setShowAllSkills] = useState<number | null>(null);
  const certifications = [
    {
      id: 1,
      title: "User Experience Design Fundamentals",
      issuer: "IBM SkillsBuild",
      issueDate: "July 20, 2025",
      certificateImage: "/gallery/certificates/IBM UX Design Fundamentals Certificate.png",
      verificationUrl: "https://www.credly.com/badges/21005cd0-749c-4f2f-a963-cdf99c978bcf",
      skills: [
        "User Research",
        "Design Thinking", 
        "Wireframing",
        "Prototyping",
        "User Journey Mapping",
        "Usability Testing"
      ],
      color: "from-blue-500 to-indigo-500",
      category: "UX/UI Design"
    },
    {
      id: 2,
      title: "n8n Course - No Code AI Agent Builder",
      issuer: "Simplilearn SkillUp",
      issueDate: "July 22, 2025",
      certificateImage: "/gallery/certificates/n8n Course - No Code AI Agent Builder.png",
      verificationUrl: "https://simpli-web.app.link/e/ewTCTOjAcVb",
      skills: [
        "API Integration",
        "n8n Workflow Automation", 
        "No-Code Tools & Development",
        "AI Agent Building",
        "Prompt Engineering Basics",
        "AI Automation",
        "Data Routing and Webhooks",
        "Business Process Automation"
      ],
      color: "from-blue-500 to-indigo-500",
      category: "Automation & AI"
    },
    {
      id: 3,
      title: "Introduction to Prompt Engineering",
      issuer: "Simplilearn SkillUp",
      issueDate: "July 22, 2025",
      certificateImage: "/gallery/certificates/Introduction to Prompt Engineering.png",
      verificationUrl: "https://simpli-web.app.link/e/4Ou6bJpGcVb",
      skills: [
        "Problem Solving",
        "Refining Prompts",
        "Prompt Engineering",
        "Conversational AI",
        "Prompt Design Techniques",
        "ChatGPT",
        "Prompt Optimization"
      ],
      color: "from-blue-500 to-indigo-500",
      category: "AI"
    }
    // Add more certificates here as needed
    // {
    //   id: 2,
    //   title: "Another Certificate",
    //   issuer: "Another Provider",
    //   issueDate: "Date",
    //   certificateImage: "/certificates/another-cert.png",
    //   verificationUrl: "verification-url",
    //   skills: ["Skill1", "Skill2"],
    //   icon: "📜",
    //   color: "from-green-500 to-teal-500",
    //   category: "Development"
    // }
  ];

  return (
    <section id="certifications" className="py-20 px-6 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-fade-in">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Award className="h-8 w-8 text-blue-400" />
            <h2 className="text-4xl font-bold gradient-text">Certifications</h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional certifications and credentials that validate my expertise and commitment to continuous learning
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="scroll-fade-in glassmorphism rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {cert.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-300 text-sm mb-1">
                      <Award className="h-3 w-3" />
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>
                </div>
                
                {/* Verification Badge */}
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>

              {/* Certificate Image */}
              <div className="mb-4">
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  <img
                    src={cert.certificateImage}
                    alt={`${cert.title} Certificate`}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </div>

              {/* Skills Gained */}
              <div className="mb-4 relative">
                <h4 className="text-sm font-semibold text-white mb-2">Skills & Competencies</h4>
                <div className="flex flex-wrap gap-1">
                  {cert.skills.slice(0, 4).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 4 && (
                    <div className="relative">
                      <span 
                        className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs cursor-pointer hover:bg-gray-500/30 transition-colors"
                        onMouseEnter={() => setShowAllSkills(cert.id)}
                        onMouseLeave={() => setShowAllSkills(null)}
                      >
                        +{cert.skills.length - 4} more
                      </span>
                      
                      {/* Skills Modal */}
                      {showAllSkills === cert.id && (
                        <div 
                          className="absolute z-50 bottom-full left-0 mb-2 p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[280px] max-w-[320px]"
                          onMouseEnter={() => setShowAllSkills(cert.id)}
                          onMouseLeave={() => setShowAllSkills(null)}
                        >
                          <h5 className="text-sm font-semibold text-white mb-3 border-b border-gray-600 pb-2">
                            All Skills & Competencies
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {cert.skills.map((skill, skillIndex) => (
                              <div 
                                key={skillIndex}
                                className="flex items-center space-x-2"
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cert.color} flex-shrink-0`}></div>
                                <span className="text-xs text-gray-300">
                                  {skill}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-600">
                            <div className="text-xs text-gray-400 text-center">
                              {cert.skills.length} total skills
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Info */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                <div className="text-gray-400 text-xs">
                  <span>{cert.category}</span>
                </div>
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
