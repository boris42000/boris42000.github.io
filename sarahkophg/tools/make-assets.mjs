/**
 * favicon.svg → PNG icons, the hero frame → og-image.jpg, and the About portrait
 * (img/author.JPG, kept outside the curated photos/ set) → img/author-{480,600}.*.
 * Run `npm run assets`.
 */
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const svg = await readFile(path.join(ROOT, 'favicon.svg'))

// About portrait. Source is only ~600px wide, so 600 is the largest rendition worth
// writing — 900/1120 would just upscale. Grayscale to sit with the rest of the page.
{
  const src = sharp(path.join(ROOT, 'img', 'author.JPG')).rotate().grayscale()
  for (const w of [480, 600]) {
    const r = src.clone().resize({ width: w, withoutEnlargement: true })
    await r.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(ROOT, 'img', `author-${w}.avif`))
    await r.clone().webp({ quality: 76 }).toFile(path.join(ROOT, 'img', `author-${w}.webp`))
    await r.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(ROOT, 'img', `author-${w}.jpg`))
  }
  console.log('✓ img/author-{480,600}.{avif,webp,jpg}')
}

for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(ROOT, name))
  console.log(`✓ ${name} ${size}×${size}`)
}

// Social card: an attention-cropped frame of the hero portrait. No text — the
// og:title supplies the words, and baking type in would need the webfont installed
// system-wide, which it isn't.
await sharp(path.join(ROOT, 'photos', 'IMG_7597_Original.jpg'))
  .grayscale()
  .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile(path.join(ROOT, 'og-image.jpg'))
console.log('✓ og-image.jpg 1200×630')

await writeFile(path.join(ROOT, 'site.webmanifest'), `${JSON.stringify({
  name: 'Sarah Ko — čiernobiela fotografia',
  short_name: 'Sarah Ko',
  lang: 'sk',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#f4f1ea',
  theme_color: '#f4f1ea',
  icons: [
    { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2)}\n`)
console.log('✓ site.webmanifest')
