import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

const mockOpenModal = vi.fn();
const mockCloseModal = vi.fn();

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
    activeModal: null,
    activeProject: null,
    activeBlogSlug: null,
  }),
}));

let capturedSearch: URLSearchParams | null = null;
vi.mock('next/navigation', () => ({
  useSearchParams: () => capturedSearch,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => '/',
}));

import { ModalAutoOpen } from '@/app/ModalAutoOpen';

describe('ModalAutoOpen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedSearch = null;
  });

  it('opens blog modal when ?modal=blog is in the URL', () => {
    capturedSearch = new URLSearchParams('modal=blog');
    render(<ModalAutoOpen />);
    expect(mockOpenModal).toHaveBeenCalledWith('blog');
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('opens blog-post modal with slug when ?modal=blog-post&slug=foo', () => {
    capturedSearch = new URLSearchParams('modal=blog-post&slug=hello-world');
    render(<ModalAutoOpen />);
    expect(mockOpenModal).toHaveBeenCalledWith('blog-post', 'hello-world');
  });

  it('does not call openModal for an unknown modal name', () => {
    capturedSearch = new URLSearchParams('modal=hacker');
    render(<ModalAutoOpen />);
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('does not call openModal when no modal param is present', () => {
    capturedSearch = new URLSearchParams();
    render(<ModalAutoOpen />);
    expect(mockOpenModal).not.toHaveBeenCalled();
  });
});
