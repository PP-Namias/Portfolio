'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, BookOpen, FolderOpen, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

const suggestions = [
  { label: 'Home', href: '/', icon: Home, description: 'Back to portfolio' },
  { label: 'Blog', href: '/blog', icon: BookOpen, description: 'Read my articles' },
];

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <span className={glitch ? 'opacity-0' : 'opacity-100'}>{text}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-accent-pink -translate-x-[2px] translate-y-[2px] opacity-70">
            {text}
          </span>
          <span className="absolute inset-0 text-blue-400 translate-x-[2px] -translate-y-[2px] opacity-70">
            {text}
          </span>
        </>
      )}
    </span>
  );
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-16 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-pink/5"
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              left: `${15 + i * 14}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
      >
        <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-gradient-to-b from-accent-pink via-accent-pink-hover-dark to-accent-pink/20 bg-clip-text text-transparent select-none">
          <GlitchText text="404" />
        </h1>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
          Page not found
        </h2>
        <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Here are some helpful links instead.
        </p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        {suggestions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark px-5 py-3 transition-all hover:border-accent-pink/50 hover:shadow-lg hover:shadow-accent-pink/5"
          >
            <item.icon className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark group-hover:text-accent-pink transition-colors" />
            <div className="text-left">
              <div className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {item.label}
              </div>
              <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Go back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
