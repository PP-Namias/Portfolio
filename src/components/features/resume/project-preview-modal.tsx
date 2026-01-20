import { motion, AnimatePresence } from 'framer-motion';
import { Chip, Button } from '@heroui/react';
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Project {
  title: string;
  image: string;
  description: string;
  repositoryURL: string | null;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
}

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPreviewModal = ({
  project,
  isOpen,
  onClose,
}: ProjectPreviewModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Trap focus within modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-testid="modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-2xl bg-resume-bg border border-resume-border rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-title"
              data-testid="project-modal"
            >
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute top-4 right-4 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-resume-border/50 hover:bg-resume-border active:scale-95 text-resume-secondary hover:text-resume-primary transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-resume-accent touch-manipulation"
                aria-label="Close modal (Press Escape)"
                data-testid="close-button"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="p-6 pb-4 border-b border-resume-border">
                <h3
                  id="project-title"
                  className="text-xl font-bold text-resume-primary pr-10"
                >
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-resume-secondary">
                  <Calendar size={14} />
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Description */}
                <div>
                  <p className="text-resume-primary leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm text-resume-secondary">
                    <Tag size={14} />
                    <span className="font-medium">Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 10).map((tag, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-xs"
                      >
                        {tag}
                      </Chip>
                    ))}
                    {project.tags.length > 10 && (
                      <Chip
                        size="sm"
                        variant="bordered"
                        color="default"
                        className="text-xs"
                      >
                        +{project.tags.length - 10} more
                      </Chip>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 pt-4 border-t border-resume-border flex flex-wrap gap-3">
                {project.liveURL && (
                  <Button
                    as="a"
                    href={project.liveURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    variant="solid"
                    size="md"
                    className="min-h-[44px] touch-manipulation active:scale-95 transition-transform"
                    startContent={<ExternalLink size={16} />}
                    data-testid="live-link"
                  >
                    View Live
                  </Button>
                )}
                {project.repositoryURL && (
                  <Button
                    as="a"
                    href={project.repositoryURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="default"
                    variant="bordered"
                    size="md"
                    className="min-h-[44px] touch-manipulation active:scale-95 transition-transform"
                    startContent={<Github size={16} />}
                    data-testid="repo-link"
                  >
                    View Code
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  color="default"
                  variant="light"
                  size="md"
                  className="ml-auto min-h-[44px] touch-manipulation active:scale-95 transition-transform"
                  data-testid="close-footer-button"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
