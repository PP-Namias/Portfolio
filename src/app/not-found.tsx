'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const GLITCH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Gilda+Display&display=swap');

@font-face {
  font-family: OCR-A;
  src: url('data:font/woff;base64,d09GRgABAAAAAHBsAA8AAAAAt8QAAQBQAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABWAAAABwAAAAcKIgPf0dERUYAAAF0AAAAHgAAACABKAAET1MvMgAAAZQAAABMAAAAVm6xgqtjbWFwAAAB4AAAAfUAAAJiFS8wSGN2dCAAAAPYAAAAXwAAAaANACd4ZnBnbQAABDgAAAL4AAAFGNSI+xRnbHlmAAAHMAAAXPoAAJiE86qh7GhlYWQAAGQsAAAAMwAAADYGj4TnaGhlYQAAZGAAAAAgAAAAJA3WBmdobXR4AABkgAAAATIAAAH+fzRrz2xvY2EAAGW0AAAB+AAAAfjGPet6bWF4cAAAZ6wAAAAgAAAAIAL7AlZuYW1lAABnzAAABNEAAAsGXuXsS3Bvc3QAAGygAAABvQAAAm07tFf7cHJlcAAAbmAAAAIMAAACpT51oqgAAAABAAAAAMmJbzEAAAAAq8rFpAAAAACzM9qpeJxjYGRgYOADYgkGEGBiYATCX0DMAuYxAAAPCAEtAAB4nGNgZLnKOIGBlYGDdRarMQMDwyYIzfiYoZZJiIOfiZGVk4mRiZGZGSgHwnDg6+/nz+DAoPCBmdXw3wzGb2x3GbMUgBpBcgD1TQxDeJxjYGBgZoBgGQZGIMnAGAPkMYL5LIwOQNqHwYGBlYGHoY5hG8N/RkNGJ8ZgxkTGCsY6xklMx5lOMt1lPqAgoiClIKegpKCmYKBgpbBGUUlRTYlJiU2JX0lISVRJSklOSVvJQylBKVX11Afm//+BpiowLGDYATTNkTGIMQFoWi3QtGNA024ATRNWkFCQUVAAm2aJYpog0DRJuGkpQNMY/v////j/of8H/0/43/i/6H/a/4D/Pv8t/7H9Y/37/a/og8MPDjzY/2Dfg90PNj1Y9cDy/pH7B+89u/f43u17t+7duHf13qV7x+6tujf53oTbOgLfISFAPcDIxgA3kpEJSDChKwAGPQsrGzsHJxc3Dy8fv4CgkLCIqJi4hKSUtIysnLyCopKyiqqauoamlraOrp6+gaGRsYmpmbmFpZW1ja2dvYOjk7OLq5u7h6eXt4+vn39AYFBwSGhYeERkVHRMbFx8QiJDa1tH16TpcxctXLx0ybIVq1auXrNu7foNm7Zs3rp92+5de/beK0pJzXxQsaAg+1lZ1uf2mR+Kv3xNL3/x+tXVjznVDMt3NiTnvT/96WVuzcOkxpZpR45eu377zo2bO74dOMHw9PETBob7DLfuPmruburp7Ouf0DtlKsPk2XNmHTxzufD8hYuVVy6dBQAFSsIqAAAAeJxjYAABVkMQySLAgAaYjzKoguj/t1HFGTPQVZIPOKB4QMAqIF6NxF+OQ90KKth1muEMw1mGczAuYwjDOgZJRgZGJoZ9DKsZLRnCgDAPCKeAIKM5MzfDH4ZPAOQMEZwAeJyFVEtv00AQXid9Ji11kj7Sui1rlpSCE8KbqKogqrOuqgjUllSyKw52mkhpTj1z6q3SJj+CnzBGHCJO+Qn8CMQJJITUc5m1nfQhBJLt/Wa+mdnZbyYpl16+eP7s6ZPHj4oPC3njwf31e2u5u+yOTm+vrixrS4vZhfm52Uw6pc7cmp5KJiYnxsdGR+IxheQVyJq2vzhuaLquO4XIXrpuQzyn/taBpK8FaTeSlm/YKzfs1aH9FsgsWMysyMI+sb4DyYAyC0TuomTe4E5REm+0GT+GRbPhuphRYSoF61cxaiWo7ScTJjObiUKe+IkkwiQijD3xFeuVEoCYxTf8GJmYLuQhbUAsx+XbhnLHRcAqWAmZzCXTu+h3r1IE0wYoEyIFxkwYD/alx1D2gHSon++Lbk8lddeYarCG9x6V87BHn8RzvFWTOnL5ui0KI1g8+GjoobxFBZNy8JaLX1bBrL/60T1p2md6X4M0rhxSBmxjxPaHb1pc8OwxlaYQZxQ+7tlXWV1+HcfJYsOCMy' /* truncated */
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
  overflow: hidden;
}

.error-404-layer {
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
  color: white;
  pointer-events: none;
}

.error-404-layer.layer-1 {
  -webkit-animation: noise-1 .2s linear infinite;
  animation: noise-1 .2s linear infinite;
}

.error-404-layer.layer-2 {
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

.info-layer {
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
  color: white;
  pointer-events: none;
}

.info-layer.layer-1 {
  -webkit-animation: noise-2 .2s linear infinite;
  animation: noise-2 .2s linear infinite;
}

.info-layer.layer-2 {
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

code span.blue {
  color: #48beef;
}

code span.comment {
  color: #7f8c8d;
}

code span.orange {
  color: #f39c12;
}

code span.green {
  color: #33cc33;
}

pre {
  margin: 0;
  padding: 0;
}

pre code {
  white-space: pre;
}
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

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden select-none">
      {/*
        404 section here - Glitched out by ZonFire99
        https://codepen.io/ZonFire99/full/njdls/
        this is a one page website, how the fuck you got here?
        Original uses body::before/::after which don't work in React,
        so we use real div elements with the same animation.
      */}

      {/* "error 404" glitched text layers */}
      <div className="error-404-layer layer-1">error 404</div>
      <div className="error-404-layer layer-2">error 404</div>
      <div className="error" />

      {/* HTML code block */}
      <div className="wrap">
        <div className="404">
          <pre><code>
            <span className="green">{'<!'}</span><span>DOCTYPE html</span><span className="green">{'>'}</span>
            {'\n'}
            <span className="orange">{'<html>'}</span>
            {'\n  '}
            <span className="orange">{'<style>'}</span>
            {'\n    * {'}
            {'\n      '}<span className="green">everything</span>:<span className="blue">awesome</span>;
            {'\n    '}
            <span className="orange">{'</style>'}</span>
            {'\n  '}
            <span className="orange">{'<body>'}</span>
            {'\n    ERROR 404!'}
            {'\n    FILE NOT FOUND!'}
            {'\n    '}
            <span className="comment">{'<!--this is a one page website,'}</span>
            {'\n      '}<span className="comment">{'how the fuck you got here?-->'}</span>
            {'\n  '}
            <span className="orange">{'</body>'}</span>
            {'\n'}
            <span className="orange">{'</html>'}</span>
          </code></pre>
        </div>
        <br />
        <span className="info">
          <div className="info-layer layer-1">file not found</div>
          <div className="info-layer layer-2">file not found</div>
          <br />
          <span className="orange">&nbsp;&lt;/body&gt;</span>
          <br />
          <span className="orange">&lt;/html&gt;</span>
        </span>
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
