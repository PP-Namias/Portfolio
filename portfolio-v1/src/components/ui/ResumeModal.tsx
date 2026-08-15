'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';

const LOAD_TIMEOUT_MS = 15_000;
const BACKDROP_PADDING = 48;
const SAFETY_MARGIN = 16;
const RESUME_SWR_KEY = '/api/resume';

function calcPanelStyle(): React.CSSProperties {
  if (typeof window === 'undefined') return { width: 600, height: 840 };
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const h = Math.round(vh - BACKDROP_PADDING - SAFETY_MARGIN);
  const w = Math.min(Math.round(vw - BACKDROP_PADDING - SAFETY_MARGIN), 900);
  return { width: w, height: h };
}

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeModal({ open, onClose }: Readonly<ResumeModalProps>) {
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>(calcPanelStyle);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate } = useSWRConfig();
  const hasLoadedOnceRef = useRef(false);

  const { data, isLoading, error: swrError } = useSWR<{ resumeUrl?: string }>(
    open ? RESUME_SWR_KEY : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`resume url fetch failed: ${res.status}`);
      return (await res.json()) as { resumeUrl?: string };
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300_000, // 5 minutes - resume doesn't change often
      keepPreviousData: true, // Don't flash loading state on re-open
      revalidateOnMount: true,
      errorRetryCount: 2,
    },
  );

  const resumeUrl =
    typeof data?.resumeUrl === 'string' && data.resumeUrl.trim().length > 0
      ? data.resumeUrl.trim()
      : null;

  // Recalculate on resize while open
  useEffect(() => {
    if (!open) return;
    const update = () => setPanelStyle(calcPanelStyle());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [open]);

  // Only show loading spinner on FIRST load, not on subsequent opens
  useEffect(() => {
    if (!open) return;
    // If we already have data cached, skip loading state
    if (data && resumeUrl && hasLoadedOnceRef.current) {
      setPdfLoading(false);
      setPdfError(false);
      return;
    }
    // First time or no cache - show loading
    setPdfLoading(true);
    setPdfError(false);
  }, [open, data, resumeUrl]);

  // Mark as loaded once iframe fires onLoad
  useEffect(() => {
    if (!pdfLoading && resumeUrl && !pdfError) {
      hasLoadedOnceRef.current = true;
    }
  }, [pdfLoading, resumeUrl, pdfError]);

  // Timeout: if iframe onLoad never fires, show error
  useEffect(() => {
    if (pdfLoading && !swrError && open) {
      loadTimerRef.current = setTimeout(() => {
        setPdfLoading(false);
        setPdfError(true);
      }, LOAD_TIMEOUT_MS);
    }
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, [pdfLoading, swrError, open]);

  const handleLoad = useCallback(() => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setPdfLoading(false);
    hasLoadedOnceRef.current = true;
  }, []);

  const handleError = useCallback(() => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setPdfLoading(false);
    setPdfError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setPdfLoading(true);
    setPdfError(false);
    hasLoadedOnceRef.current = false;
    mutate(RESUME_SWR_KEY);
  }, [mutate]);

  const showFetching = isLoading && !data;
  const showIframeLoading = pdfLoading && !showFetching && !swrError && resumeUrl;
  const showError = (swrError || pdfError) && resumeUrl;
  const noResume = !showFetching && !resumeUrl;

  const iframeSrc = resumeUrl ?? '';

  return (
    <Modal open={open} onClose={onClose} showCloseButton={false} scrollable={false} panelStyle={panelStyle}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
          Resume
        </h2>
        <div className="flex items-center gap-3">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Resume
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-11 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-lg"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {showFetching && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white dark:bg-card-bg-dark z-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent-pink" />
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Loading resume...</p>
          </div>
        )}

        {showIframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white dark:bg-card-bg-dark z-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent-pink" />
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Loading PDF...</p>
          </div>
        )}

        {noResume && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white dark:bg-card-bg-dark z-10 px-6 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              No resume available yet.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {showError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white dark:bg-card-bg-dark z-10 px-6 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Unable to display the resume inline.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors"
              >
                <Download className="h-4 w-4" />
                Open in New Tab
              </a>
            </div>
          </div>
        )}

        {!showFetching && resumeUrl && (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            className="w-full h-full border-0"
            title="Resume PDF Viewer"
            loading="lazy"
            sandbox="allow-scripts allow-popups"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </Modal>
  );
}
