'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Modal } from './Modal';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const CAL_USERNAME = 'pp-namias';
const CAL_BASE_URL = 'https://cal.com';

const EVENT_TYPES = [
  { slug: '15min', label: '15 Minute Meeting', duration: '15 min' },
  { slug: '30min', label: '30 Minute Meeting', duration: '30 min' },
] as const;

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<string>(EVENT_TYPES[0].slug);
  const embedUrl = `${CAL_BASE_URL}/${CAL_USERNAME}/${selectedEvent}?embed=true&theme=dark`;

  return (
    <Modal open={open} onClose={onClose} fullScreen>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
            Schedule a Meeting
          </h2>
          {/* Event type selector */}
          <div className="flex items-center gap-1.5">
            {EVENT_TYPES.map((event) => (
              <button
                key={event.slug}
                onClick={() => setSelectedEvent(event.slug)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  selectedEvent === event.slug
                    ? 'bg-accent-pink text-white'
                    : 'bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
                }`}
              >
                {event.duration}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`${CAL_BASE_URL}/${CAL_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-accent-pink hover:text-accent-pink transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Cal.com
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

      {/* Cal.com Embed */}
      <div className="flex-1" style={{ height: 'calc(92vh - 60px)', minHeight: '500px' }}>
        <iframe
          key={selectedEvent}
          src={embedUrl}
          className="w-full h-full border-0"
          title={`Book a ${selectedEvent} meeting with PP Namias`}
          allow="payment"
          loading="lazy"
        />
      </div>
    </Modal>
  );
}
