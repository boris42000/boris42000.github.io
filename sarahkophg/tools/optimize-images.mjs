/**
 * photos/*.{jpg,jpeg}  →  img/{slug}-{width}.{avif,webp,jpg}
 *                      →  img/{slug}-sq-{400,800}.{avif,webp,jpg}   (Instagram grid)
 *                      →  img/manifest.json                          (dims + LQIP)
 *
 * Run with `npm run images`. Output is committed, so the site itself does no image
 * work at deploy time and you can see exactly what gets published.
 *
 * Most frames are desaturated on the way through — the core of the portfolio is
 * "Svet vnímam najradšej v čiernobielej." Two masters (IMG_0758, IMG_0975) were shot
 * in colour and stay that way (`mono: false`): deliberate accents, not the default.
 */
import sharp from 'sharp'
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HERE, '..', 'photos')
const OUT = path.join(HERE, '..', 'img')
const WIDTHS = [480, 768, 1120, 1600]
const HERO_WIDTH = 2000
const SQUARES = [400, 800]

/**
 * AVIF and WebP carry every width. JPEG is only a safety net for browsers that
 * support neither (~2%, and none of them are on a 4K display), so it stops at 1120
 * rather than doubling the repo for renditions nobody fetches.
 */
const JPEG_MAX_WIDTH = 1120

/**
 * Source file → slug + category. Explicit rather than globbed: the order here IS the
 * curation, and the slugs are what the markup reads.
 *
 * 16 of the 22 masters ship. The rest are held back on purpose — near-duplicates
 * (several belly-and-hands frames of the same idea, several near-identical forest
 * walking frames), one blown-flare frame, and the dog portrait, which is off-message
 * for a couples/family/maternity photographer. Add a line here and re-run to publish
 * one. `mono: false` keeps a frame in colour instead of the default desaturation.
 */
const PHOTOS = [
  // Portrait / artistic — the most abstract work in the set.
  { file: 'IMG_7597_Original.jpg', slug: 'portret-01', cat: 'portret', hero: true,
    alt: 'Profil ženy so steblami trávy cez tvár, tmavý čiernobiely portrét' },
  { file: 'IMG_7102_Original.JPG', slug: 'portret-02', cat: 'portret',
    alt: 'Žena držiaca steblá tráv pri tvári, mäkké svetlo' },
  { file: 'IMG_7583_Original.jpg', slug: 'portret-03', cat: 'portret',
    alt: 'Detail profilu tváre za rozostrenými steblami trávy' },
  { file: 'IMG_7227_Original.jpg', slug: 'portret-04', cat: 'portret',
    alt: 'Žena zaklonená v tráve so zavretými očami, mäkké svetlo' },

  // Maternity + couples.
  { file: 'IMG_0758.jpg', slug: 'tehotenske-01', cat: 'tehotenske', mono: false,
    alt: 'Nastávajúci rodičia čelo na čele, tehotenské bruško v protisvetle, farebná fotografia' },
  { file: 'IMG_0627.jpg', slug: 'tehotenske-02', cat: 'tehotenske',
    alt: 'Objatie páru v lese, tehotenské fotenie' },
  { file: 'IMG_0532.jpg', slug: 'tehotenske-03', cat: 'tehotenske',
    alt: 'Pár na prechádzke medzi stromami, protisvetlo' },
  { file: 'IMG_0932.jpg', slug: 'tehotenske-04', cat: 'tehotenske',
    alt: 'Ruky na tehotenskom brušku, tieň tráv na koži' },
  { file: 'IMG_0975.jpg', slug: 'tehotenske-05', cat: 'tehotenske', mono: false,
    alt: 'Tehotenské bruško s poľnými kvetmi, farebná fotografia' },
  { file: 'IMG_1521.jpg', slug: 'tehotenske-06', cat: 'tehotenske',
    alt: 'Pár si spolu prezerá ultrazvukovú fotografiu' },
  { file: 'IMG_0937.jpg', slug: 'tehotenske-07', cat: 'tehotenske',
    alt: 'Ruky v tvare srdca na tehotenskom brušku' },

  // Newborn / family.
  { file: 'IMG_0173.jpeg', slug: 'rodina-01', cat: 'rodina',
    alt: 'Detské nôžky v dlaniach rodičov' },
  { file: 'IMG_0067.jpeg', slug: 'rodina-02', cat: 'rodina',
    alt: 'Spiace novorodeniatko, detail tváre' },
  { file: 'IMG_0073.jpeg', slug: 'rodina-03', cat: 'rodina',
    alt: 'Malá pästička držiaca prst dospelého' },
  { file: 'IMG_0192.jpeg', slug: 'rodina-04', cat: 'rodina',
    alt: 'Rodič pobozká novorodeniatko na čelo' },
  { file: 'IMG_0230.jpeg', slug: 'rodina-05', cat: 'rodina',
    alt: 'Bozk na drobnú detskú dlaň' },
]

const encoders = (pipe, { jpeg = true } = {}) =>
  [
    { ext: 'avif', run: () => pipe.clone().avif({ quality: 52, effort: 6 }) },
    { ext: 'webp', run: () => pipe.clone().webp({ quality: 74 }) },
    jpeg && {
      ext: 'jpg',
      run: () => pipe.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }),
    },
  ].filter(Boolean)

await mkdir(OUT, { recursive: true })

const present = new Set(await readdir(SRC))
const missing = PHOTOS.filter((p) => !present.has(p.file))
if (missing.length) {
  console.error(`Missing from photos/:\n  ${missing.map((m) => m.file).join('\n  ')}`)
  process.exit(1)
}

const manifest = {}

for (const photo of PHOTOS) {
  const input = path.join(SRC, photo.file)
  // .grayscale() before anything else so every downstream rendition agrees.
  // `mono: false` opts a frame out — a deliberate colour accent, not the default.
  const mono = photo.mono === false ? sharp(input) : sharp(input).grayscale()
  const meta = await mono.metadata()

  const widths = photo.hero ? [...WIDTHS, HERO_WIDTH] : WIDTHS
  const emitted = []

  for (const w of widths) {
    if (w > meta.width) continue
    const resized = mono.clone().resize({ width: w, withoutEnlargement: true })
    await Promise.all(
      encoders(resized, { jpeg: w <= JPEG_MAX_WIDTH }).map(({ ext, run }) =>
        run().toFile(path.join(OUT, `${photo.slug}-${w}.${ext}`)),
      ),
    )
    emitted.push(w)
  }

  // Square crops for the Instagram grid. `attention` picks the most salient region,
  // which matters here — a centre crop would behead half these portraits.
  for (const s of SQUARES) {
    const square = mono
      .clone()
      .resize({ width: s, height: s, fit: 'cover', position: sharp.strategy.attention })
    await Promise.all(
      encoders(square, { jpeg: s <= 400 }).map(({ ext, run }) =>
        run().toFile(path.join(OUT, `${photo.slug}-sq-${s}.${ext}`)),
      ),
    )
  }

  // 20px blurred JPEG, inlined as a background-image so each slot has something in it
  // before the real file lands.
  const lqip = await mono.clone().resize({ width: 20 }).blur(1.4).jpeg({ quality: 40 }).toBuffer()

  manifest[photo.slug] = {
    cat: photo.cat,
    alt: photo.alt,
    width: meta.width,
    height: meta.height,
    widths: emitted,
    jpegWidths: emitted.filter((w) => w <= JPEG_MAX_WIDTH),
    squares: SQUARES,
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
  }

  console.log(`✓ ${photo.slug.padEnd(14)} ${String(meta.width).padStart(4)}×${meta.height}  ${photo.file}`)
}

await writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\n✓ img/manifest.json — ${Object.keys(manifest).length} images`)
