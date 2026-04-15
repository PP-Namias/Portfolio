import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ModalProvider, useModal } from '@/hooks/useModal';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock modal components to verify they receive correct props
vi.mock('@/components/ui/ResumeModal', () => ({
  ResumeModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    open ? <div data-testid="resume-modal"><button onClick={onClose}>Close Resume</button></div> : null
  ),
}));

vi.mock('@/components/ui/ExperienceModal', () => ({
  ExperienceModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    open ? <div data-testid="experience-modal"><button onClick={onClose}>Close Experience</button></div> : null
  ),
}));

vi.mock('@/components/ui/BookingModal', () => ({
  BookingModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    open ? <div data-testid="booking-modal"><button onClick={onClose}>Close Booking</button></div> : null
  ),
}));

vi.mock('@/components/ui/ProjectDetailModal', () => ({
  ProjectDetailModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    open ? <div data-testid="project-modal"><button onClick={onClose}>Close Project</button></div> : null
  ),
}));

// Mock data modules used by modal components
vi.mock('@/data/experience', () => ({
  experiences: [],
}));

function TestConsumer() {
  const { openModal, closeModal } = useModal();
  return (
    <div>
      <button onClick={() => openModal('resume')}>Open Resume</button>
      <button onClick={() => openModal('experience')}>Open Experience</button>
      <button onClick={() => openModal('booking')}>Open Booking</button>
      <button
        onClick={() =>
          openModal('project', {
            title: 'Sample Project',
            image: 'sample.png',
            description: 'Sample description',
            repositoryURL: null,
            liveURL: null,
            processURL: null,
            tags: ['React'],
            year: 2026,
          })
        }
      >
        Open Project
      </button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ModalProvider>
      <TestConsumer />
    </ModalProvider>
  );
}

describe('useModal / ModalProvider', () => {
  it('no modals are open by default', () => {
    renderWithProvider();
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('experience-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('booking-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
  });

  it('opens resume modal', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Resume'));
    expect(screen.getByTestId('resume-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('experience-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('booking-modal')).not.toBeInTheDocument();
  });

  it('opens experience modal', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Experience'));
    expect(screen.getByTestId('experience-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
  });

  it('opens booking modal', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Booking'));
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
  });

  it('opens project modal', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Project'));
    expect(screen.getByTestId('project-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
  });

  it('closes modal via closeModal', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Resume'));
    expect(screen.getByTestId('resume-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
  });

  it('switching modals closes the previous one', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Resume'));
    expect(screen.getByTestId('resume-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Booking'));
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
  });

  it('modal onClose callback works', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Open Booking'));
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Booking'));
    expect(screen.queryByTestId('booking-modal')).not.toBeInTheDocument();
  });
});
