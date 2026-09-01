/**
 * img/manifest.json  →  index.html
 *
 * Writes every <picture> block with the right srcset, intrinsic width/height and
 * blur-up placeholder. Run `npm run page` after changing the photo set.
 *
 * The page is deliberately photo-led: a hero that is nothing but the menu, two
 * full-screen frames and one call to action, then a mosaic of every remaining
 * photograph, its only copy the category tags set on the pictures. The booking
 * section — three lines about how a shoot goes, and two links — closes the scroll.
 *
 * The generated index.html is plain static HTML and is the committed artifact — you
 * can edit copy in it directly. Only re-run this if the photo set changes, which
 * would overwrite such edits (the copy also lives in COPY below).
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..')
const manifest = JSON.parse(await readFile(path.join(ROOT, 'img', 'manifest.json'), 'utf8'))

// ── Identity ────────────────────────────────────────────────────────────────────
// TODO: swap EMAIL for the real address. It is used in the booking section and the
// JSON-LD, so changing it here (and re-running `npm run page`) or find-and-replacing
// it in index.html both work.
const NAME = 'Sarah Ko.'
const HANDLE = 'sarahko.phg'
const EMAIL = 'ahoj@sarahkophg.sk'
const ORIGIN = 'https://boris42000.github.io'
const BASE = `${ORIGIN}/sarahkophg/`
const IG = `https://www.instagram.com/${HANDLE}/`

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── <picture> ───────────────────────────────────────────────────────────────────
/**
 * `slot` scales the intrinsic dimensions to the largest rendition actually emitted,
 * so the browser reserves the right box and nothing shifts on load.
 */
function picture(slug, { sizes, alt, loading = 'lazy', priority = false, square = false, className = '', pos = '' }) {
  const m = manifest[slug]
  if (!m) throw new Error(`Unknown slug: ${slug}`)

  const set = (ext, widths, suffix = '') =>
    widths.map((w) => `img/${slug}${suffix}-${w}.${ext} ${w}w`).join(', ')

  const widths = square ? m.squares : m.widths
  const jpegWidths = square ? m.squares.filter((w) => w <= 400) : m.jpegWidths
  const suffix = square ? '-sq' : ''

  const maxW = Math.max(...widths)
  const w = maxW
  const h = square ? maxW : Math.round((m.height / m.width) * maxW)
  const fallback = `img/${slug}${suffix}-${Math.max(...jpegWidths)}.jpg`

  return `<picture>
            <source type="image/avif" srcset="${set('avif', widths, suffix)}" sizes="${sizes}">
            <source type="image/webp" srcset="${set('webp', widths, suffix)}" sizes="${sizes}">
            <img class="ph${className ? ` ${className}` : ''}" src="${fallback}"
                 srcset="${set('jpg', jpegWidths, suffix)}" sizes="${sizes}"
                 width="${w}" height="${h}" alt="${esc(alt ?? m.alt)}"
                 loading="${loading}" decoding="async"${priority ? ' fetchpriority="high"' : ''}
                 style="background-image:url(${m.lqip})${pos ? `;object-position:${pos}` : ''}">
          </picture>`
}

// ── Copy ────────────────────────────────────────────────────────────────────────
// There is almost none, on purpose. What survives is either set on a photograph in
// the mosaic or lives in the two closing sections at the foot of the page.
const NAV = [
  ['#portfolio', 'Portfólio'], ['#rezervacia', 'Rezervácia'],
]

// The whole of the written page: three lines in the booking section at the foot.
const STEPS = [
  { n: '01', title: 'Naladenie', text: 'spoznáme sa, vyberieme miesto' },
  { n: '02', title: 'Fotenie', text: 'voľná prechádzka, bez pózovania' },
  { n: '03', title: 'Odovzdanie', text: 'starostlivo vybrané zábery' },
]

// The only two frames that are not in the mosaic — they carry the hero. Everything
// else is published exactly once, so the scroll never shows the same photograph twice.
const HERO_A = 'portret-01'
const HERO_B = 'tehotenske-02'

/**
 * The mosaic. One entry per band; `cols` is the desktop grid track list, `h` the band
 * height step (sm / md / lg), `pos` the crop point, and `label` the one bit of copy a
 * tile may carry — the category tag, set over the photograph itself.
 *
 * Below 900px every band collapses to two columns (a trailing odd tile goes full
 * width), so the track lists only need to read well on desktop.
 */
const MOSAIC = [
  { h: 'md', cols: '1fr 1fr', tiles: [
    { slug: 'tehotenske-08', pos: '50% 45%', label: 'Páry a tehotenské' },
    { slug: 'tehotenske-10', pos: '50% 30%' },
  ] },
  { h: 'lg', cols: '1fr', tiles: [
    { slug: 'tehotenske-03', pos: '50% 30%' },
  ] },
  { h: 'md', cols: '2fr 1fr', tiles: [
    { slug: 'tehotenske-06', pos: '50% 40%' },
    { slug: 'tehotenske-04' },
  ] },
  { h: 'md', cols: '1fr 1fr', tiles: [
    { slug: 'tehotenske-07' },
    { slug: 'tehotenske-09', pos: '50% 40%' },
  ] },
  // The two frames that were shot in colour, kept together so the break reads as a
  // decision rather than an accident.
  { h: 'md', cols: '1fr 1fr', tiles: [
    { slug: 'tehotenske-01', pos: '50% 28%' },
    { slug: 'tehotenske-05', pos: '50% 45%' },
  ] },
  { h: 'md', cols: '1fr 1fr', tiles: [
    { slug: 'rodina-02', pos: '50% 40%', label: 'Deti a rodina' },
    { slug: 'rodina-04', pos: '50% 35%' },
  ] },
  { h: 'sm', cols: '1fr 1fr 1fr', tiles: [
    { slug: 'rodina-03' },
    { slug: 'rodina-07' },
    { slug: 'rodina-06', pos: '50% 40%' },
  ] },
  { h: 'md', cols: '3fr 2fr', tiles: [
    { slug: 'rodina-01' },
    { slug: 'rodina-05' },
  ] },
  { h: 'md', cols: '1fr 1fr 1fr', tiles: [
    { slug: 'portret-03', pos: '50% 35%', label: 'Portrét' },
    { slug: 'portret-02', pos: '50% 35%' },
    { slug: 'portret-04', pos: '50% 40%' },
  ] },
]

// Flattened once: the lightbox indexes into this, in scroll order.
const mosaic = MOSAIC.flatMap((row) => row.tiles.map((t) => t.slug))

const unused = Object.keys(manifest).filter((s) => ![...mosaic, HERO_A, HERO_B].includes(s))
if (unused.length) console.warn(`! not on the page: ${unused.join(', ')}`)

// ── Assemble ────────────────────────────────────────────────────────────────────
// Bands are at most full width and usually a fraction of it; one `sizes` covers all
// of them closely enough that no tile ever fetches a rendition two steps too big.
const TILE_SIZES = '(min-width: 900px) 50vw, 50vw'

const tileHTML = (tile, i) => {
  const m = manifest[tile.slug]
  return `<figure class="tile">
          <button class="tile__btn" data-i="${i}" aria-label="Zväčšiť fotografiu: ${esc(m.alt)}">
            ${picture(tile.slug, { sizes: TILE_SIZES, className: 'tile__img', pos: tile.pos })}
          </button>
        </figure>`
}

let tileIndex = 0

const html = `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f4f1ea">
<title>${NAME} — čiernobiela fotografia pre rodiny, páry a budúce mamičky</title>
<meta name="description" content="Autentická čiernobiela fotografia pre rodiny, páry a budúce mamičky. Zachytávam blízkosť, emócie a detaily také, aké naozaj sú.">
<link rel="canonical" href="${BASE}">

<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<meta property="og:type" content="website">
<meta property="og:locale" content="sk_SK">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${NAME} — skutočné momenty namiesto dokonalých póz">
<meta property="og:description" content="Autentická čiernobiela fotografia pre rodiny, páry a budúce mamičky.">
<meta property="og:url" content="${BASE}">
<meta property="og:image" content="${BASE}og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" href="fonts/cormorant-garamond-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/jetbrains-mono-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">

<!-- Must run before first paint: the markup ships visible so the page renders fine
     with no JS, and this flips on the styles that start it hidden for the reveal. -->
<script>document.documentElement.classList.add('js')</script>

<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': BASE,
  name: NAME,
  description: 'Autentická čiernobiela fotografia pre rodiny, páry a budúce mamičky.',
  url: BASE,
  email: EMAIL,
  image: `${BASE}og-image.jpg`,
  areaServed: 'SK',
  sameAs: [IG],
  knowsLanguage: 'sk',
  makesOffer: ['Páry a tehotenské', 'Deti a rodina', 'Portrét'].map((label) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: label },
  })),
}, null, 2)}
</script>
</head>
<body>

<a class="skip" href="#obsah">Preskočiť na obsah</a>

<header class="hdr" id="hdr">
  <a class="hdr__mark" href="#top">${NAME}</a>
  <nav class="hdr__nav" aria-label="Hlavná navigácia">
    ${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('\n    ')}
  </nav>
  <button class="hdr__toggle" id="navToggle" aria-expanded="false" aria-controls="navPanel">
    <span class="hdr__toggle-label">Menu</span>
  </button>
</header>

<div class="navpanel" id="navPanel" hidden>
  <nav aria-label="Navigácia v mobile">
    ${NAV.map(([h, l], i) => `<a href="${h}"><span class="navpanel__n">0${i + 1}</span>${l}</a>`).join('\n    ')}
  </nav>
  <div class="navpanel__foot">
    <a href="${IG}" target="_blank" rel="noopener">@${HANDLE} ↗</a>
    <a href="mailto:${EMAIL}">${EMAIL}</a>
  </div>
</div>

<main id="obsah">

  <!-- Menu, two frames filling the screen between them, one call to action. The
       heading is there for search engines and screen readers only. -->
  <section class="hero" id="top">
    <h1 class="vh">${NAME} — čiernobiela fotografia pre rodiny, páry a budúce mamičky</h1>
    <div class="hero__frame hero__frame--a">
      ${picture(HERO_A, { sizes: '(min-width: 900px) 50vw, 100vw', loading: 'eager', priority: true, className: 'hero__img', pos: '50% 35%' })}
    </div>
    <div class="hero__frame hero__frame--b">
      ${picture(HERO_B, { sizes: '(min-width: 900px) 50vw, 100vw', loading: 'eager', className: 'hero__img', pos: '50% 40%' })}
    </div>
    <div class="hero__cta">
      <a class="btn" href="#rezervacia">Rezervovať fotenie</a>
    </div>
  </section>

  <!-- The portfolio itself: every remaining photograph, the copy set on top of it. -->
  <section class="mosaic" id="portfolio" aria-label="Portfólio">
    ${MOSAIC.map((row) => `<div class="mrow mrow--${row.h}" style="--cols:${row.cols}">
        ${row.tiles.map((t) => tileHTML(t, tileIndex++)).join('\n        ')}
      </div>`).join('\n    ')}
    <p class="mosaic__ig"><a class="link" href="${IG}" target="_blank" rel="noopener">Viac fotografií na Instagrame @${HANDLE} ↗</a></p>
  </section>

  <section class="contact" id="rezervacia">
    <div class="contact__body">
      <p class="eyebrow">Rezervácia</p>
      <h2 class="contact__title">Poďme fotiť.</h2>
      <p>Momentálne rozširujem portfólio — napíšte mi a dohodneme si termín za zvýhodnených podmienok.</p>
      <ol class="msteps">
        ${STEPS.map((s) => `<li>
          <span class="msteps__n">${s.n}</span>
          <span class="msteps__title">${s.title}</span>
          <span class="msteps__text">${s.text}</span>
        </li>`).join('\n        ')}
      </ol>
      <div class="contact__links">
        <a class="link link--lg" href="mailto:${EMAIL}?subject=${encodeURIComponent('Rezervácia fotenia')}">Napíšte mi</a>
        <a class="link link--lg" href="${IG}" target="_blank" rel="noopener">Instagram ↗</a>
      </div>
    </div>
  </section>

</main>

<footer class="foot">
  <span>© <span id="year">2026</span> ${NAME}</span>
  <span>Čiernobiela fotografia</span>
</footer>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Zväčšená fotografia">
  <button class="lb__close" id="lbClose" aria-label="Zavrieť">✕</button>
  <button class="lb__nav lb__nav--prev" id="lbPrev" aria-label="Predchádzajúca fotografia">‹</button>
  <button class="lb__nav lb__nav--next" id="lbNext" aria-label="Nasledujúca fotografia">›</button>
  <figure class="lb__stage"><img id="lbImg" src="" alt=""></figure>
  <p class="lb__count"><span id="lbNow">1</span> / <span id="lbTotal">${mosaic.length}</span></p>
</div>

<script>
  window.__GALLERY__ = ${JSON.stringify(
    mosaic.map((slug) => ({
      alt: manifest[slug].alt,
      // Largest rendition actually emitted, not a hardcoded width — a smaller master
      // would otherwise point at a file the pipeline never wrote.
      src: `img/${slug}-${Math.max(...manifest[slug].widths)}.webp`,
      fallback: `img/${slug}-${Math.max(...manifest[slug].jpegWidths)}.jpg`,
    })),
  )};
</script>
<script src="main.js" defer></script>
</body>
</html>
`

await writeFile(path.join(ROOT, 'index.html'), html)
console.log(`✓ index.html — ${mosaic.length} mosaic photos + 2 in the hero, ${html.length.toLocaleString()} bytes`)
