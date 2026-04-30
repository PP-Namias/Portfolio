'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AccentScheme {
  name: string;
  label: string;
  accent: string;       // RGB triplet e.g. "219 39 119"
  hover: string;        // Darker variant
  hoverDark: string;    // Lighter variant
  preview: string;      // Hex for preview dot
}

export const ACCENT_SCHEMES: AccentScheme[] = [
  { name: 'pink',   label: 'Pink',   accent: '236 72 153',  hover: '219 39 119',  hoverDark: '244 114 182', preview: '#ec4899' },
  { name: 'blue',   label: 'Blue',   accent: '59 130 246',  hover: '37 99 235',   hoverDark: '96 165 250',  preview: '#3b82f6' },
  { name: 'purple', label: 'Purple', accent: '139 92 246',  hover: '124 58 237',  hoverDark: '167 139 250', preview: '#8b5cf6' },
  { name: 'green',  label: 'Green',  accent: '16 185 129',  hover: '5 150 105',   hoverDark: '52 211 153',  preview: '#10b981' },
  { name: 'orange', label: 'Orange', accent: '249 115 22',  hover: '234 88 12',   hoverDark: '251 146 60',  preview: '#f97316' },
  { name: 'red',    label: 'Red',    accent: '239 68 68',   hover: '220 38 38',   hoverDark: '248 113 113', preview: '#ef4444' },
  { name: 'teal',   label: 'Teal',   accent: '20 184 166',  hover: '13 148 136',  hoverDark: '94 234 212',  preview: '#14b8a6' },
  { name: 'cyan',   label: 'Cyan',   accent: '6 182 212',   hover: '8 145 178',   hoverDark: '103 232 249', preview: '#06b6d4' },
];

const STORAGE_KEY = 'accent-color';
const DEFAULT_SCHEME = ACCENT_SCHEMES[0]; // pink

interface AccentColorContextValue {
  scheme: AccentScheme;
  setScheme: (scheme: AccentScheme) => void;
  mounted: boolean;
}

const AccentColorContext = createContext<AccentColorContextValue>({
  scheme: DEFAULT_SCHEME,
  setScheme: () => {},
  mounted: false,
});

function applyScheme(scheme: AccentScheme) {
  const root = document.documentElement;
  root.style.setProperty('--accent', scheme.accent);
  root.style.setProperty('--accent-hover', scheme.hover);
  root.style.setProperty('--accent-hover-dark', scheme.hoverDark);
}

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setSchemeState] = useState<AccentScheme>(DEFAULT_SCHEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const found = ACCENT_SCHEMES.find((s) => s.name === stored);
      if (found) {
        setSchemeState(found);
        applyScheme(found);
      }
    }
    setMounted(true);
  }, []);

  const setScheme = useCallback((newScheme: AccentScheme) => {
    setSchemeState(newScheme);
    applyScheme(newScheme);
    localStorage.setItem(STORAGE_KEY, newScheme.name);
  }, []);

  return (
    <AccentColorContext.Provider value={{ scheme, setScheme, mounted }}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  return useContext(AccentColorContext);
}
