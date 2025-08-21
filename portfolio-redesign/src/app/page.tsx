import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* About Section Placeholder */}
      <section id="about" className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 text-center mb-8">About Me</h2>
          <div className="card">
            <p className="text-lg leading-relaxed text-center" style={{ color: 'var(--color-text-secondary)' }}>
              I'm a passionate full-stack software engineer with expertise in modern web technologies. 
              I enjoy building innovative solutions that make a difference in people's lives.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section Placeholder */}
      <section id="experience" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 text-center mb-8">Experience</h2>
          <div className="space-y-6">
            <div className="card">
              <h3 className="heading-3">Senior Software Engineer</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Building amazing web applications with modern technologies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section Placeholder */}
      <section id="skills" className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 text-center mb-8">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'TypeScript', 'Node.js', 'Next.js', 'PHP', 'Python', 'PostgreSQL', 'Docker'].map((skill) => (
              <div key={skill} className="badge text-center p-4 cursor-pointer hover:scale-105 transition-transform">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Placeholder */}
      <section id="projects" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 text-center mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((project) => (
              <div key={project} className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg mb-4"></div>
                <h3 className="heading-3">Project {project}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  A brief description of this amazing project and the technologies used.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Placeholder */}
      <section id="contact" className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-2 mb-8">Let's Work Together</h2>
          <div className="card">
            <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Ready to bring your ideas to life? Let's discuss your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">Get In Touch</button>
              <button className="btn-secondary">View Resume</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            © 2025 PP Namias. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
