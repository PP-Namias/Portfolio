import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const iconsDir = path.resolve(publicDir, 'icons');

const SIZES = [192, 256, 384, 512];
const APPLE_SIZES = [152, 180];

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.resolve(publicDir, 'favicon.svg'));

  for (const size of SIZES) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.resolve(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Created icon-${size}x${size}.png`);
  }

  for (const size of APPLE_SIZES) {
    const filename = size === 180 ? 'apple-touch-icon-180x180.png' : `apple-touch-icon-${size}x${size}.png`;
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.resolve(iconsDir, filename));
    console.log(`Created ${filename}`);
  }

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
}

generateIcons().catch(console.error);
