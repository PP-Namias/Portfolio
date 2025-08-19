import { experienceData } from "@/data/experience";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-6 bg-neutral/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Experience
          </h2>
          <p className="text-xl text-gray-400">
            My professional journey and achievements
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-500 hidden md:block" />

          {experienceData.map((item, index) => (
            <div key={index} className="relative mb-12 scroll-fade-in">
              {/* Timeline Dot */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full absolute left-1/2 transform -translate-x-1/2 z-20 shadow-xl shadow-blue-500/60 hidden md:block" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right">
                      <div className="glassmorphism rounded-2xl p-6">
                        <h3 className="text-2xl font-bold mb-2 gradient-text">
                          {item.title}
                        </h3>
                        <h4 className="text-xl text-primary mb-2">
                          {item.company}
                        </h4>
                        <p className="text-gray-400 mb-4">{item.period}</p>
                        <p className="text-gray-300">{item.description}</p>
                        {item.technologies && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-600/30 transition-colors duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div>
                      <div className="glassmorphism rounded-2xl p-6">
                        <h3 className="text-2xl font-bold mb-2 gradient-text">
                          {item.title}
                        </h3>
                        <h4 className="text-xl text-primary mb-2">
                          {item.company}
                        </h4>
                        <p className="text-gray-400 mb-4">{item.period}</p>
                        <p className="text-gray-300">{item.description}</p>
                        {item.technologies && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-600/30 transition-colors duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
