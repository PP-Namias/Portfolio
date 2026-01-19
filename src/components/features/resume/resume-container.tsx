import { type ReactNode } from 'react';

// Utility function for class names (simple implementation)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ResumeContainerProps {
  children: ReactNode;
  className?: string;
}

export const ResumeContainer = ({ children, className }: ResumeContainerProps) => {
  return (
    <div className={cn(
      "resume-container",
      "max-w-[1000px] mx-auto",
      "bg-resume-bg dark:bg-resume-background-alt",
      "shadow-2xl rounded-lg overflow-hidden",
      "my-8 transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};

// Resume Section Wrapper
interface ResumeSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  noBorder?: boolean;
}

export const ResumeSection = ({ 
  children, 
  id, 
  className, 
  noBorder = false 
}: ResumeSectionProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "resume-section",
        "px-8 py-10 md:px-12 md:py-12",
        !noBorder && "border-b border-resume-border",
        "transition-all duration-200",
        "page-break-inside-avoid", // Print optimization
        className
      )}
    >
      {children}
    </section>
  );
};

// Resume Section Header
interface ResumeSectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export const ResumeSectionHeader = ({ 
  children, 
  className 
}: ResumeSectionHeaderProps) => {
  return (
    <h2 className={cn(
      "resume-section-header",
      "text-2xl md:text-3xl font-semibold uppercase",
      "tracking-wide text-resume-primary",
      "mb-6 pb-3 relative",
      "after:content-[''] after:absolute after:bottom-0 after:left-0",
      "after:w-16 after:h-1 after:bg-resume-accent",
      "after:rounded-full",
      className
    )}>
      {children}
    </h2>
  );
};

// Export all components as compound component
// eslint-disable-next-line react-refresh/only-export-components
export const Resume = {
  Container: ResumeContainer,
  Section: ResumeSection,
  Header: ResumeSectionHeader,
};
