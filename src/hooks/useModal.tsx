'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { ExperienceModal } from '@/components/ui/ExperienceModal';
import { BookingModal } from '@/components/ui/BookingModal';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';
import { ModalName, Project } from '@/types';

type OpenableModalName = Exclude<ModalName, null>;

interface ModalContextValue {
  openModal: (name: OpenableModalName, project?: Project | null) => void;
  closeModal: () => void;
  activeProject: Project | null;
}

const ModalContext = createContext<ModalContextValue>({
  openModal: () => {},
  closeModal: () => {},
  activeProject: null,
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openModal = useCallback((name: OpenableModalName, project?: Project | null) => {
    if (name === 'project') {
      setActiveProject(project ?? null);
    } else {
      setActiveProject(null);
    }
    setActiveModal(name);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setActiveProject(null);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal, activeProject }),
    [openModal, closeModal, activeProject]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ResumeModal open={activeModal === 'resume'} onClose={closeModal} />
      <ExperienceModal open={activeModal === 'experience'} onClose={closeModal} />
      <BookingModal open={activeModal === 'booking'} onClose={closeModal} />
      <ProjectDetailModal open={activeModal === 'project'} onClose={closeModal} project={activeProject} />
    </ModalContext.Provider>
  );
}
