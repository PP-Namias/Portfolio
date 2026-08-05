import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(appDir, 'public');
const nextDir = path.resolve(appDir, '.next');

const BASE_ASSETS = [
  '/',
  '/offline',
  '/site.webmanifest',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon-180x180.png',
];

function collectBuildAssets(dir, prefix) {
  const assets = [];
  if (!fs.existsSync(dir)) return assets;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : `/_next/static/${entry.name}`;

    if (entry.isDirectory()) {
      assets.push(...collectBuildAssets(fullPath, relativePath));
    } else if (entry.isFile()) {
      if (/\.(js|css|svg|png|jpg|jpeg|gif|webp|avif|woff2?|ttf|eot)$/i.test(entry.name)) {
        assets.push(relativePath);
      }
    }
  }
  return assets;
}

function generateManifest() {
  const buildAssetsDir = path.resolve(nextDir, 'static');

  let allAssets = [...BASE_ASSETS];

  if (fs.existsSync(buildAssetsDir)) {
    const buildAssets = collectBuildAssets(buildAssetsDir, '');
    allAssets = [...new Set([...allAssets, ...buildAssets])];
  }

  allAssets.sort();

  const output = JSON.stringify(allAssets, null, 2);
  fs.writeFileSync(path.resolve(publicDir, 'sw-assets.json'), output, 'utf-8');
  console.log(`Generated sw-assets.json with ${allAssets.length} assets`);
}

generateManifest();
