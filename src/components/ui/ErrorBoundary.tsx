'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ErrorBoundary:${this.props.name || 'unknown'}]`, error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Something went loading this section.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
