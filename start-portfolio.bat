@echo off
title PP Namias Portfolio - Dev Server
cd /d "%~dp0portfolio-v1"
echo Starting Next.js dev server at http://localhost:3000
echo Press Ctrl+C to stop
npx next dev --port 3000
pause
