/**
 * img/manifest.json  →  index.html
 *
 * Writes every <picture> block with the right srcset, intrinsic width/height and
 * blur-up placeholder, and draws the two line-art SVGs. Run `npm run page` after
 * changing the photo set.
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
// TODO: swap EMAIL for the real address. It is used in the hero CTA, the contact
// section and the JSON-LD, so changing it here (and re-running `npm run page`) or
// find-and-replacing it in index.html both work.
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
function picture(slug, { sizes, alt, loading = 'lazy', priority = false, square = false, className = '' }) {
  const m = manifest[slug]
  if (!m) throw new Error(`Unknown slug: ${slug}`)

  const set = (ext, widths, suffix = '') =>
    widths.map((w) => `img/${slug}${suffix}-${w}.${ext} ${w}w`).join(', ')

  const widths = square ? m.squares : m.widths
  const jpegWidths = square ? m.squares.filter((w) => w <= 400) : m.jpegWidths
  const suffix = square ? '-sq' : ''

  const maxW = Math.max(...widths)
  const w = square ? maxW : maxW
  const h = square ? maxW : Math.round((m.height / m.width) * maxW)
  const fallback = `img/${slug}${suffix}-${Math.max(...jpegWidths)}.jpg`

  return `<picture>
            <source type="image/avif" srcset="${set('avif', widths, suffix)}" sizes="${sizes}">
            <source type="image/webp" srcset="${set('webp', widths, suffix)}" sizes="${sizes}">
            <img class="ph${className ? ` ${className}` : ''}" src="${fallback}"
                 srcset="${set('jpg', jpegWidths, suffix)}" sizes="${sizes}"
                 width="${w}" height="${h}" alt="${esc(alt ?? m.alt)}"
                 loading="${loading}" decoding="async"${priority ? ' fetchpriority="high"' : ''}
                 style="background-image:url(${m.lqip})">
          </picture>`
}

// ── Copy ────────────────────────────────────────────────────────────────────────
const SERVICES = [
  { n: '01', slug: 'tehotenske-02', title: 'Párové fotenie',
    text: 'Žiadny nátlak na klišé. Len vy dvaja, váš smiech a prirodzená blízkosť.' },
  { n: '02', slug: 'tehotenske-04', title: 'Tehotenské fotenie',
    text: 'Oslava nového začiatku. Jemné čiernobiele portréty čistých línií a očakávania.' },
  { n: '03', slug: 'rodina-01', title: 'Deti a rodina',
    text: 'Živé, nestrojené zábery. Deti nechávam objavovať svet po svojom – bez nútených úsmevov.' },
]

const PROCESS = [
  { n: '01', title: 'Naladenie',
    text: 'Porozprávame sa o vašej predstave, vyberieme miesto a jednoduché oblečenie bez rušivých nápisov.' },
  { n: '02', title: 'Samotné fotenie',
    text: 'Nenútená prechádzka či stretnutie. Žiadne hodiny v jednej polohe, len uvoľnená atmosféra.' },
  { n: '03', title: 'Odovzdanie',
    text: 'Dostanete starostlivo vybrané fotografie s citlivým čiernobielym tónovaním.' },
]

const FILTERS = [
  { key: 'all', label: 'Všetky' },
  { key: 'tehotenske', label: 'Páry a tehotenské' },
  { key: 'rodina', label: 'Deti a rodina' },
  { key: 'portret', label: 'Portrét' },
]

const NAV = [
  ['#pribeh', 'Príbeh'], ['#fotenia', 'Fotenia'], ['#galeria', 'Galéria'],
  ['#priebeh', 'Priebeh'], ['#instagram', 'Instagram'], ['#kontakt', 'Kontakt'],
]

const HERO = 'portret-01'
const ABOUT = 'portret-02'
const gallery = Object.keys(manifest)

// ── Assemble ────────────────────────────────────────────────────────────────────
const GALLERY_SIZES = '(min-width: 1200px) 320px, (min-width: 900px) 30vw, 46vw'

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
  makesOffer: SERVICES.map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.title, description: s.text },
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

  <section class="hero" id="top">
    <div class="hero__media">
      ${picture(HERO, { sizes: '(min-width: 900px) 54vw, 100vw', loading: 'eager', priority: true, className: 'hero__img' })}
    </div>
    <div class="hero__body">
      <p class="eyebrow">Čiernobiela fotografia — rodiny, páry, budúce mamičky</p>
      <h1 class="hero__title">Skutočné momenty <em>namiesto dokonalých</em> póz.</h1>
      <p class="hero__lede">Zachytávam blízkosť, emócie a detaily také, aké naozaj sú.</p>
      <div class="hero__cta">
        <a class="btn" href="#kontakt">Dohodnúť si fotenie</a>
        <a class="link" href="#galeria">Pozrieť galériu</a>
      </div>
    </div>
  </section>

  <section class="about" id="pribeh">
    <p class="eyebrow eyebrow--rule">O mne a mojom prístupe</p>
    <div class="about__grid">
      <div class="about__media">
        ${picture(ABOUT, { sizes: '(min-width: 900px) 40vw, 88vw' })}
      </div>
      <div class="about__body">
        <p>Najkrajšie fotografie nevznikajú v strnulých pózach, ale v medziriadkoch – v tichom pohľade, spontánnom smiechu, neposednom pohybe.</p>
        <blockquote class="pullquote">Svet vnímam najradšej v čiernobielej.</blockquote>
        <p>Odstránenie farieb necháva vyniknúť podstatné: svetlo, kontrast, čisté emócie. Nemusíte vedieť, ako sa postaviť – mojou úlohou je, aby ste sa cítili uvoľnene a sami sebou.</p>
      </div>
    </div>
  </section>

  <section class="services" id="fotenia">
    <p class="eyebrow eyebrow--rule">Čo spolu môžeme vytvoriť</p>
    <ol class="svc">
      ${SERVICES.map((s) => `<li class="svc__row">
        <a class="svc__link" href="#kontakt">
          <span class="svc__n">${s.n}</span>
          <span class="svc__main">
            <span class="svc__title">${s.title}</span>
            <span class="svc__text">${s.text}</span>
          </span>
          <span class="svc__arrow" aria-hidden="true">↗</span>
        </a>
      </li>`).join('\n      ')}
    </ol>
  </section>

  <section class="gallery" id="galeria">
    <div class="gallery__head">
      <p class="eyebrow eyebrow--rule">Galéria</p>
      <div class="filters" role="group" aria-label="Filtrovať galériu">
        ${FILTERS.map((f, i) => `<button class="filter${i === 0 ? ' is-on' : ''}" data-filter="${f.key}" aria-pressed="${i === 0}">${f.label}</button>`).join('\n        ')}
      </div>
    </div>
    <div class="grid" id="grid">
      ${gallery.map((slug, i) => `<figure class="cell" data-cat="${manifest[slug].cat}">
        <button class="cell__btn" data-i="${i}" aria-label="Zväčšiť fotografiu: ${esc(manifest[slug].alt)}">
          ${picture(slug, { sizes: GALLERY_SIZES })}
        </button>
      </figure>`).join('\n      ')}
    </div>
    <p class="grid__empty" id="gridEmpty" hidden>V tejto kategórii zatiaľ nie sú fotografie.</p>
  </section>

  <section class="process" id="priebeh">
    <p class="eyebrow eyebrow--rule eyebrow--on-clay">Ako prebieha fotenie</p>
    <ol class="steps">
      ${PROCESS.map((s) => `<li class="step">
        <span class="step__n">${s.n}</span>
        <h3 class="step__title">${s.title}</h3>
        <p class="step__text">${s.text}</p>
      </li>`).join('\n      ')}
    </ol>
  </section>

  <section class="ig" id="instagram">
    <div class="ig__head">
      <p class="eyebrow">Instagram</p>
      <a class="link" href="${IG}" target="_blank" rel="noopener">@${HANDLE} ↗</a>
    </div>
    <ul class="ig__grid">
      ${gallery.map((slug) => `<li class="ig__cell">
        <a href="${IG}" target="_blank" rel="noopener">
          ${picture(slug, { sizes: '(min-width: 900px) 18vw, 32vw', square: true, alt: `${manifest[slug].alt} — otvoriť profil na Instagrame` })}
          <span class="ig__veil" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>
            </svg>
          </span>
        </a>
      </li>`).join('\n      ')}
    </ul>
    <a class="btn btn--wide" href="${IG}" target="_blank" rel="noopener">Sledovať na Instagrame</a>
  </section>

  <section class="contact" id="kontakt">
    <div class="contact__body">
      <h2 class="contact__title">Máte chuť vytvoriť spomienky, ktoré nestratia na hodnote ani po rokoch?</h2>
      <p>Momentálne rozširujem portfólio, preto vám rada ponúknem fotenie za zvýhodnených podmienok.</p>
      <p>Napíšte mi správu a dohodneme si termín, ktorý vám vyhovuje.</p>
      <div class="contact__links">
        <a class="link link--lg" href="mailto:${EMAIL}">Napíšte mi</a>
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
  <p class="lb__count"><span id="lbNow">1</span> / <span id="lbTotal">${gallery.length}</span></p>
</div>

<script>
  window.__GALLERY__ = ${JSON.stringify(
    gallery.map((slug) => ({
      cat: manifest[slug].cat,
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
console.log(`✓ index.html — ${gallery.length} gallery images, ${html.length.toLocaleString()} bytes`)
