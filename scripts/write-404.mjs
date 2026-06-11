#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const fontPath = resolve(root, 'scripts', 'ocr-a.woff.b64');
const fontB64 = readFileSync(fontPath, 'utf8').trim();

const content = `'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const GLITCH_CSS = \`
@import url('https://fonts.googleapis.com/css2?family=Gilda+Display&display=swap');

@font-face {
  font-family: OCR-A;
  src: url('data:font/woff;base64,${fontB64}') format('woff');
  font-weight: normal;
  font-style: normal;
}

html {
  background-color: black;
  color: white;
  overflow: hidden;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: medium;
}

.error {
  text-align: center;
  font-family: 'Gilda Display', serif;
  width: 100%;
  height: 120px;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60px;
  right: 0;
  -webkit-animation: noise-3 1s linear infinite;
  animation: noise-3 1s linear infinite;
  overflow: default;
}

body:after {
  content: 'error 404';
  font-family: OCR-A;
  font-size: 100px;
  text-align: center;
  width: 550px;
  margin: auto;
  position: absolute;
  top: 25%;
  bottom: 0;
  left: 0;
  right: 35%;
  opacity: 0;
  color: white;
  -webkit-animation: noise-1 .2s linear infinite;
  animation: noise-1 .2s linear infinite;
}

body:before {
  content: 'error 404';
  font-family: OCR-A;
  font-size: 100px;
  text-align: center;
  width: 550px;
  margin: auto;
  position: absolute;
  top: 25%;
  bottom: 0;
  left: 0;
  right: 35%;
  opacity: 0;
  color: white;
  -webkit-animation: noise-2 .2s linear infinite;
  animation: noise-2 .2s linear infinite;
}

.info {
  text-align: center;
  width: 200px;
  height: 60px;
  margin: auto;
  position: absolute;
  top: 280px;
  bottom: 0;
  left: 20px;
  right: 0;
  -webkit-animation: noise-3 1s linear infinite;
  animation: noise-3 1s linear infinite;
}

.info:before {
  content: 'file not found';
  font-family: OCR-A;
  font-size: 100px;
  text-align: center;
  width: 800px;
  margin: auto;
  position: absolute;
  top: 20px;
  bottom: 0;
  left: 40px;
  right: 100px;
  opacity: 0;
  color: white;
  -webkit-animation: noise-2 .2s linear infinite;
  animation: noise-2 .2s linear infinite;
}

.info:after {
  content: 'file not found';
  font-family: OCR-A;
  font-size: 100px;
  text-align: center;
  width: 800px;
  margin: auto;
  position: absolute;
  top: 20px;
  bottom: 0;
  left: 40px;
  right: 0;
  opacity: 0;
  color: white;
  -webkit-animation: noise-1 .2s linear infinite;
  animation: noise-1 .2s linear infinite;
}

@-webkit-keyframes noise-1 {
  0%, 20%, 40%, 60%, 70%, 90% { opacity: 0; }
  10% { opacity: .1; }
  50% { opacity: .5; left: -6px; }
  80% { opacity: .3; }
  100% { opacity: .6; left: 2px; }
}

@keyframes noise-1 {
  0%, 20%, 40%, 60%, 70%, 90% { opacity: 0; }
  10% { opacity: .1; }
  50% { opacity: .5; left: -6px; }
  80% { opacity: .3; }
  100% { opacity: .6; left: 2px; }
}

@-webkit-keyframes noise-2 {
  0%, 20%, 40%, 60%, 70%, 90% { opacity: 0; }
  10% { opacity: .1; }
  50% { opacity: .5; left: 6px; }
  80% { opacity: .3; }
  100% { opacity: .6; left: -2px; }
}

@keyframes noise-2 {
  0%, 20%, 40%, 60%, 70%, 90% { opacity: 0; }
  10% { opacity: .1; }
  50% { opacity: .5; left: 6px; }
  80% { opacity: .3; }
  100% { opacity: .6; left: -2px; }
}

@-webkit-keyframes noise {
  0%, 3%, 5%, 42%, 44%, 100% { opacity: 1; -webkit-transform: scaleY(1); transform: scaleY(1); }
  4.3% { opacity: 1; -webkit-transform: scaleY(1.7); transform: scaleY(1.7); }
  43% { opacity: 1; -webkit-transform: scaleX(1.5); transform: scaleX(1.5); }
}

@keyframes noise {
  0%, 3%, 5%, 42%, 44%, 100% { opacity: 1; -webkit-transform: scaleY(1); transform: scaleY(1); }
  4.3% { opacity: 1; -webkit-transform: scaleY(1.7); transform: scaleY(1.7); }
  43% { opacity: 1; -webkit-transform: scaleX(1.5); transform: scaleX(1.5); }
}

@-webkit-keyframes noise-3 {
  0%, 3%, 5%, 42%, 44%, 100% { opacity: 1; -webkit-transform: scaleY(1); transform: scaleY(1); }
  4.3% { opacity: 1; -webkit-transform: scaleY(4); transform: scaleY(4); }
  43% { opacity: 1; -webkit-transform: scaleX(10) rotate(60deg); transform: scaleX(10) rotate(60deg); }
}

@keyframes noise-3 {
  0%, 3%, 5%, 42%, 44%, 100% { opacity: 1; -webkit-transform: scaleY(1); transform: scaleY(1); }
  4.3% { opacity: 1; -webkit-transform: scaleY(4); transform: scaleY(4); }
  43% { opacity: 1; -webkit-transform: scaleX(10) rotate(60deg); transform: scaleX(10) rotate(60deg); }
}

.wrap {
  top: 30%;
  left: 25%;
  height: 200px;
  margin-top: -100px;
  position: absolute;
}

code {
  color: white;
}

span.blue {
  color: #48beef;
}

span.comment {
  color: #7f8c8d;
}

span.orange {
  color: #f39c12;
}

span.green {
  color: #33cc33;
}
\`;

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden select-none">
      {/* 404 - Glitched out by ZonFire99 (https://codepen.io/ZonFire99/full/njdls/) */}
      {/* error 404 glitched text (via body::before and body::after) */}
      <div className="error" />

      {/* HTML code block */}
      <div className="wrap">
        <div className="404">
          <pre><code>
<span className="green">&lt;!</span><span>DOCTYPE html</span><span className="green">&gt;</span>
<span className="orange">&lt;html&gt;</span>
  <span className="orange">&lt;style&gt;</span>
    * {'{'} <span className="green">everything</span>:<span className="blue">awesome</span>; {'}'}
  <span className="orange">&lt;/style&gt;</span>
  <span className="orange">&lt;body&gt;</span>
    ERROR 404!
    FILE NOT FOUND!
    <span className="comment">&lt;!--The file you are looking for,
      is not where you think it is.--&gt;</span>
  <span className="orange">&lt;/body&gt;</span>
<span className="orange">&lt;/html&gt;</span>
          </code></pre>
        </div>
        <br />
        <span className="info">
          <br />
          <span className="orange">&nbsp;&lt;/body&gt;</span>
          <br />
          <span className="orange">&lt;/html&gt;</span>
        </span>
      </div>

      {/* Custom message */}
      <div
        className="absolute top-[60%] left-0 right-0 text-center z-10 px-4"
        style={{ fontFamily: "'Gilda Display', serif" }}
      >
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
          there&apos;s only one page website
        </p>
        <p
          className="text-xl sm:text-2xl md:text-3xl font-bold mt-2"
          style={{ color: '#f39c12' }}
        >
          how the fuck you got here?
        </p>
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="absolute bottom-10 left-0 right-0 text-center z-10 inline-block px-6 py-3 text-sm font-medium text-white border border-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        &larr; take me back
      </Link>
    </div>
  );
}
`;

const outPath = resolve(root, 'src', 'app', 'not-found.tsx');
writeFileSync(outPath, content, 'utf8');
console.log('Wrote', outPath);
