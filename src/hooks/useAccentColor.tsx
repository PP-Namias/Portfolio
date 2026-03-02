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
  { name: 'pink',   label: 'Pink',   accent: '219 39 119',  hover: '190 24 93',   hoverDark: '244 114 182', preview: '#db2777' },
  { name: 'blue',   label: 'Blue',   accent: '37 99 235',   hover: '29 78 216',   hoverDark: '96 165 250',  preview: '#2563eb' },
  { name: 'purple', label: 'Purple', accent: '124 58 237',  hover: '109 40 217',  hoverDark: '167 139 250', preview: '#7c3aed' },
  { name: 'green',  label: 'Green',  accent: '5 150 105',   hover: '4 120 87',    hoverDark: '52 211 153',  preview: '#059669' },
  { name: 'orange', label: 'Orange', accent: '234 88 12',   hover: '194 65 12',   hoverDark: '251 146 60',  preview: '#ea580c' },
  { name: 'red',    label: 'Red',    accent: '220 38 38',   hover: '185 28 28',   hoverDark: '248 113 113', preview: '#dc2626' },
  { name: 'teal',   label: 'Teal',   accent: '13 148 136',  hover: '15 118 110',  hoverDark: '94 234 212',  preview: '#0d9488' },
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
