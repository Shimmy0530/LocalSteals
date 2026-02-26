// Generate PWA icon files from the logo
// Run with: node scripts/generate-icons.mjs

import sharp from "sharp";

const INPUT = "public/logo.png";

const icons = [
  { name: "public/icon-192x192.png", size: 192 },
  { name: "public/icon-512x512.png", size: 512 },
  { name: "public/favicon.ico", size: 32 },
];

for (const { name, size } of icons) {
  await sharp(INPUT)
    .resize(size, size, { fit: "contain", background: { r: 10, g: 10, b: 10, alpha: 0 } })
    .png()
    .toFile(name);
  console.log(`Generated ${name} (${size}x${size})`);
}

console.log("All icons generated from logo.png");
