'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { ExperienceModal } from '@/components/ui/ExperienceModal';

type ModalName = 'resume' | 'experience' | null;

interface ModalContextValue {
  openModal: (name: 'resume' | 'experience') => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  openModal: () => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const openModal = useCallback((name: 'resume' | 'experience') => {
    setActiveModal(name);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ResumeModal open={activeModal === 'resume'} onClose={closeModal} />
      <ExperienceModal open={activeModal === 'experience'} onClose={closeModal} />
    </ModalContext.Provider>
  );
}
