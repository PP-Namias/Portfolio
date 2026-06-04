'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useModal } from '@/hooks/useModal';

const VALID_MODALS = new Set(['resume', 'experience', 'booking', 'contact', 'project', 'blog', 'blog-post']);

export function ModalAutoOpen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, closeModal } = useModal();
  const lastHandled = useRef<string | null>(null);

  useEffect(() => {
    const modal = searchParams.get('modal');
    const slug = searchParams.get('slug');
    const key = `${modal ?? ''}::${slug ?? ''}`;

    if (lastHandled.current === key) return;
    lastHandled.current = key;

    if (modal && VALID_MODALS.has(modal)) {
      if (modal === 'blog-post' && slug) {
        openModal('blog-post', slug);
      } else if (modal === 'blog') {
        openModal('blog');
      } else {
        openModal(modal as never);
      }
    } else if (!modal) {
      closeModal();
    }
  }, [searchParams, openModal, closeModal]);

  useEffect(() => {
    if (pathname === '/') return;
  }, [pathname]);

  useEffect(() => {
    const originalReplaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = function (...args) {
      lastHandled.current = null;
      return originalReplaceState(...args);
    };
    return () => {
      window.history.replaceState = originalReplaceState;
    };
  }, [router]);

  return null;
}
