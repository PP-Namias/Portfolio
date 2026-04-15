'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { ExperienceModal } from '@/components/ui/ExperienceModal';
import { BookingModal } from '@/components/ui/BookingModal';
import { ModalName } from '@/types';

type OpenableModalName = Exclude<ModalName, null>;

interface ModalContextValue {
  openModal: (name: OpenableModalName) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  openModal: () => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const openModal = useCallback((name: OpenableModalName) => {
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
      <BookingModal open={activeModal === 'booking'} onClose={closeModal} />
    </ModalContext.Provider>
  );
}
