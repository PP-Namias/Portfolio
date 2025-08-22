import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="nav nav-sticky">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bryl Lim
            </h1>
          </div>

          {/* Navigation */}
          <nav className="nav-links hidden md:flex">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#experience" className="nav-link">
              Experience
            </a>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
