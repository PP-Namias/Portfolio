'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Modal } from './Modal';

const fallbackResumeUrl = '/resume.pdf';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeModal({ open, onClose }: Readonly<ResumeModalProps>) {
  const [resumeUrl, setResumeUrl] = useState(fallbackResumeUrl);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    const loadResumeUrl = async () => {
      try {
        const response = await fetch('/api/resume', { signal: controller.signal });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { resumeUrl?: string };
        if (typeof data.resumeUrl === 'string' && data.resumeUrl.trim().length > 0) {
          setResumeUrl(data.resumeUrl.trim());
        }
      } catch {
        // Keep the fallback URL when the runtime cannot resolve the CMS value yet.
      }
    };

    void loadResumeUrl();

    return () => {
      controller.abort();
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} fullScreen>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
          Resume
        </h2>
        <div className="flex items-center gap-3">
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-lg"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 h-[calc(92vh-60px)] min-h-[500px]">
        <iframe
          src={`${resumeUrl}#view=FitH`}
          className="w-full h-full border-0"
          title="Resume PDF Viewer"
          loading="lazy"
          // Empty sandbox (most restrictive). The browser's built-in
          // PDF viewer (pdfium) renders the PDF natively; no scripts
          // or same-origin access are needed for static PDF display.
          sandbox=""
        >
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Your browser doesn&apos;t support embedded PDF viewing.
            </p>
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </iframe>
      </div>
    </Modal>
  );
}
