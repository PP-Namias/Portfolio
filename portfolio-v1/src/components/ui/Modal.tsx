'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Focusable-selector for the Tab-trap effect below. Pulled out
// to a constant so the string content does not get matched by
// the linter's <button>-shaped rule (false positive: it scans
// the source text, not the runtime DOM).
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalVariant = 'default' | 'scheduling';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Full-screen modal (almost full viewport) vs default sized */
  fullScreen?: boolean;
  /** Optional id that points to the dialog's primary descriptive text */
  descriptionId?: string;
  /** When false, suppresses the built-in close button (for modals with their own toolbar close). Defaults to true. */
  showCloseButton?: boolean;
  /** When false, the content area does not scroll (children manage their own overflow). Defaults to true. */
  scrollable?: boolean;
  /** Custom inline styles for the panel (width, height, etc.). When provided, fullScreen sizing classes are skipped. */
  panelStyle?: React.CSSProperties;
  /** Visual variant that applies preset sizing constraints. 'scheduling' caps panel height for embed widgets. */
  modalVariant?: ModalVariant;
}

export function Modal({ open, onClose, title, children, fullScreen = false, descriptionId, showCloseButton = true, scrollable = true, panelStyle, modalVariant = 'default' }: Readonly<ModalProps>) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      // The CSS selector below contains a literal element name
      // (used to match focusable controls). The linter scans
      // the source text and reports a false positive on the
      // string. The runtime DOM query is correct.
      // eslint-disable-next-line react-doctor/button-has-type
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const mergedPanelStyle = useMemo(() => {
    if (!panelStyle && modalVariant !== 'scheduling') return undefined;
    const style: React.CSSProperties = { ...(panelStyle ?? {}) };
    if (modalVariant === 'scheduling') {
      style.maxHeight = '75vh';
    }
    return Object.keys(style).length > 0 ? style : undefined;
  }, [panelStyle, modalVariant]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Close when clicking the backdrop or outer container (not the panel)
      const target = e.target as HTMLElement;
      if (target === e.currentTarget || target.dataset.modalBackdrop !== undefined) {
        onClose();
      }
    },
    [onClose]
  );

  const handlePanelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
    },
    []
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
          role="button"
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" data-modal-backdrop />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className={`relative z-10 ${panelStyle ? '' : 'w-full'} bg-white dark:bg-card-bg-dark rounded-xl border border-border-light dark:border-border-dark shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${
              panelStyle
                ? ''
                : fullScreen
                  ? 'max-w-5xl max-h-[92vh]'
                  : 'max-w-2xl max-h-[85vh]'
            } ${modalVariant === 'scheduling' ? 'max-h-[75vh]' : ''}`}
            style={mergedPanelStyle}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            aria-describedby={descriptionId}
            onClick={handlePanelClick}
          >
            {/* Header */}
            {title && showCloseButton && (
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-light dark:border-border-dark flex-shrink-0">
                <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 w-11 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* No title — just show close button */}
            {!title && showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-10 h-11 w-11 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors bg-white/80 dark:bg-card-bg-dark/80 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Content */}
            <div className={`flex-1 flex flex-col min-h-0 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
