'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { ExperienceModal } from '@/components/ui/ExperienceModal';
import { BookingModal } from '@/components/ui/BookingModal';
import { ContactModal } from '@/components/ui/ContactModal';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';
import { BlogListModal } from '@/components/ui/BlogListModal';
import { BlogPostModal } from '@/components/ui/BlogPostModal';
import { ModalName, Project } from '@/types';

type OpenableModalName = Exclude<ModalName, null>;

interface ModalContextValue {
  openModal: (name: OpenableModalName, payload?: Project | string | null) => void;
  closeModal: () => void;
  activeProject: Project | null;
  activeBlogSlug: string | null;
}

const ModalContext = createContext<ModalContextValue>({
  openModal: () => {},
  closeModal: () => {},
  activeProject: null,
  activeBlogSlug: null,
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);

  const openModal = useCallback((name: OpenableModalName, payload?: Project | string | null) => {
    if (name === 'project') {
      setActiveProject((payload as Project | null) ?? null);
      setActiveBlogSlug(null);
    } else if (name === 'blog-post') {
      setActiveProject(null);
      setActiveBlogSlug((payload as string | null) ?? null);
    } else {
      setActiveProject(null);
      setActiveBlogSlug(null);
    }
    setActiveModal(name);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setActiveProject(null);
    setActiveBlogSlug(null);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal, activeProject, activeBlogSlug }),
    [openModal, closeModal, activeProject, activeBlogSlug]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ResumeModal open={activeModal === 'resume'} onClose={closeModal} />
      <ExperienceModal open={activeModal === 'experience'} onClose={closeModal} />
      <BookingModal open={activeModal === 'booking'} onClose={closeModal} />
      <ContactModal open={activeModal === 'contact'} onClose={closeModal} />
      <ProjectDetailModal open={activeModal === 'project'} onClose={closeModal} project={activeProject} />
      <BlogListModal open={activeModal === 'blog'} onClose={closeModal} />
      <BlogPostModal open={activeModal === 'blog-post'} onClose={closeModal} slug={activeBlogSlug} />
    </ModalContext.Provider>
  );
}
