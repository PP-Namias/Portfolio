'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

const GLITCH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Gilda+Display&family=Oxanium:wght@700&display=swap');

@keyframes noise-1 {
  0%, 100% { background-position: 0 0; }
  10% { background-position: -5% -10%; }
  20% { background-position: -15% 5%; }
  30% { background-position: 7% -25%; }
  40% { background-position: 20% 25%; }
  50% { background-position: -25% 10%; }
  60% { background-position: 15% 5%; }
  70% { background-position: 0% 15%; }
  80% { background-position: 25% 35%; }
  90% { background-position: -10% 10%; }
}

@keyframes noise-2 {
  0%, 100% { background-position: 0 0; }
  10% { background-position: 5% 10%; }
  20% { background-position: -10% -5%; }
  30% { background-position: 15% -20%; }
  40% { background-position: -20% -25%; }
  50% { background-position: 25% -10%; }
  60% { background-position: -15% 10%; }
  70% { background-position: 10% -15%; }
  80% { background-position: -25% 25%; }
  90% { background-position: 5% -5%; }
}

@keyframes noise-3 {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5px, 5px); }
  20% { transform: translate(-10px, 15px); }
  30% { transform: translate(5px, -5px); }
  40% { transform: translate(15px, -25px); }
  50% { transform: translate(-25px, 10px); }
  60% { transform: translate(15px, 15px); }
  70% { transform: translate(0px, 15px); }
  80% { transform: translate(-15px, -15px); }
  90% { transform: translate(10px, 5px); }
}

@keyframes glitch-skew {
  0%, 100% { transform: skew(0deg); }
  20% { transform: skew(-2deg); }
  40% { transform: skew(3deg); }
  60% { transform: skew(-1deg); }
  80% { transform: skew(2deg); }
}

@keyframes glitch-blink {
  0%, 100% { opacity: 1; }
  33% { opacity: 0; }
  66% { opacity: 1; }
}

.noise-1,
.noise-2,
.noise-3 {
  content: "";
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxM8MAAAACHRSTlMAIBAgECAQIFClbV0AAAAJcEhZcwAADsQAAA7EAZUrDhsAAAA2SURBVDjLY2AYBaNgFIyCUTAKRsEoGAWjYBTwHAA5DQALhMg0NTc3twAAAABJRU5ErkJggg==") repeat;
  opacity: 0.15;
  z-index: 100;
  pointer-events: none;
}

.noise-1 { animation: noise-1 0.5s infinite linear; }
.noise-2 { animation: noise-2 0.5s infinite linear reverse; }
.noise-3 { animation: noise-3 0.5s infinite linear; }

.glitch-wrapper {
  position: relative;
}

.glitch-wrapper::before,
.glitch-wrapper::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.glitch-wrapper::before {
  color: #0ff;
  z-index: -1;
  animation: glitch-skew 3s infinite linear alternate-reverse;
}

.glitch-wrapper::after {
  color: #f0f;
  z-index: -2;
  animation: glitch-skew 3s infinite linear alternate-reverse;
  animation-delay: 0.1s;
}

.code-block {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.6;
  color: #555;
  text-align: left;
  user-select: none;
  pointer-events: none;
  white-space: pre;
}

.code-block .c-pink { color: #ff6188; }
.code-block .c-blue { color: #a9b7c6; }
.code-block .c-green { color: #6a8759; }
.code-block .c-yellow { color: #bbb529; }
.code-block .c-orange { color: #ff6188; }
.code-block .c-cyan { color: #6897bb; }
.code-block .c-red { color: #cc7832; }
.code-block .c-white { color: #a9b7c6; }
`;

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLITCH_CSS;
    document.head.appendChild(style);
    setMounted(true);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const codeLines = useMemo(() => [
    { text: '  <', color: 'c-red' },
    { text: 'div', color: 'c-white' },
    { text: ' ', color: 'c-white' },
    { text: 'class', color: 'c-yellow' },
    { text: '=', color: 'c-white' },
    { text: '"portfolio"', color: 'c-green' },
    { text: '>', color: 'c-red' },
    { text: '\n', color: 'c-white' },
    { text: '    ', color: 'c-white' },
    { text: '<', color: 'c-red' },
    { text: 'h1', color: 'c-white' },
    { text: '>', color: 'c-red' },
    { text: '404', color: 'c-cyan' },
    { text: '</', color: 'c-red' },
    { text: 'h1', color: 'c-white' },
    { text: '>', color: 'c-red' },
    { text: '\n', color: 'c-white' },
    { text: '    ', color: 'c-white' },
    { text: '<', color: 'c-red' },
    { text: 'p', color: 'c-white' },
    { text: '>', color: 'c-red' },
    { text: 'this page', color: 'c-green' },
    { text: ' ', color: 'c-green' },
    { text: 'doesnt', color: 'c-green' },
    { text: ' ', color: 'c-green' },
    { text: 'exist', color: 'c-green' },
    { text: '</', color: 'c-red' },
    { text: 'p', color: 'c-white' },
    { text: '>', color: 'c-red' },
    { text: '\n', color: 'c-white' },
    { text: '  </', color: 'c-red' },
    { text: 'div', color: 'c-white' },
    { text: '>', color: 'c-red' },
  ], []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Noise overlays */}
      <div className="noise-1" aria-hidden="true" />
      <div className="noise-2" aria-hidden="true" />
      <div className="noise-3" aria-hidden="true" />

      {/* Code display */}
      <div className="code-block mb-6 opacity-30 hidden md:block">
        {codeLines.map((char, i) => (
          <span key={i} className={char.color}>{char.text}</span>
        ))}
      </div>

      {/* 404 - glitched */}
      <div className="glitch-wrapper text-center" data-text="404">
        <h1
          className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter select-none"
          style={{
            fontFamily: "'Oxanium', sans-serif",
            color: '#fff',
            textShadow: '0 0 20px rgba(219, 39, 119, 0.5), 0 0 40px rgba(219, 39, 119, 0.3), 0 0 80px rgba(219, 39, 119, 0.15)',
          }}
        >
          404
        </h1>
      </div>

      {/* Message */}
      <div className="mt-6 text-center max-w-lg px-4">
        <p
          className="text-lg sm:text-xl md:text-2xl text-gray-300"
          style={{ fontFamily: "'Gilda Display', serif" }}
        >
          there&apos;s only one page website
        </p>
        <p
          className="text-xl sm:text-2xl md:text-3xl font-bold mt-2"
          style={{
            fontFamily: "'Gilda Display', serif",
            color: '#db2777',
            textShadow: '0 0 10px rgba(219, 39, 119, 0.4)',
          }}
        >
          how the fuck you got here?
        </p>
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-gray-700 rounded-lg hover:border-[#db2777] hover:text-[#db2777] transition-all duration-300 hover:shadow-[0_0_15px_rgba(219,39,119,0.3)]"
        style={{ fontFamily: "'Oxanium', sans-serif" }}
      >
        &larr; take me back
      </Link>

      {/* Decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(219, 39, 119, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
