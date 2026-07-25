# ABMaudit — web

Statický web pre **ABM AUDIT s.r.o.** React 19 + Tailwind v4 + Vite. Build je čisto
statický — žiadny server, žiadna databáza, žiadny PHP. Nahráva sa cez FTP.

---

## Rýchly štart

```bash
cd abmaudit
npm install
npm run dev        # vývojový server na http://localhost:5173
```

## Nasadenie na FTP

```bash
npm run build      # vytvorí priečinok dist/
npm run preview    # kontrola produkčnej verzie pred nahratím
```

Potom nahrajte **obsah** priečinka `dist/` (nie priečinok samotný) do koreňa webu
na hostingu.

> **Pozor na tri veci:**
> 1. **`.htaccess` je skrytý súbor.** FileZilla ho štandardne nezobrazuje —
>    zapnite *Server → Vynútiť zobrazenie skrytých súborov*. Bez neho nebude
>    fungovať presmerovanie z HTTP na HTTPS.
> 2. **Prenos musí byť binárny**, nie ASCII. V ASCII režime sa poškodia fonty
>    (`.woff2`) a obrázky (`.avif`, `.webp`, `.jpg`).
> 3. **Zmažte staré súbory** z hostingu (`assets/vendor/`, `assets/css/`,
>    `assets/js/`, `inner-page.html`, `Readme.txt`, `changelog.txt`). Inak tam
>    zostane ~9 MB starého kódu, ktorý si môžu indexovať vyhľadávače.
>    Pred zásahom si spravte zálohu celého webu.

Web funguje v koreňi domény aj v podpriečinku — cesty k súborom sú relatívne
(`base: './'` vo `vite.config.ts`).

---

## Kde sa čo mení

### Texty

**Všetok text je v jedinom súbore: [`src/content/site.ts`](src/content/site.ts).**
Nemeňte texty v komponentoch. Po úprave spustite `npm run build` a nahrajte `dist/`.

Nájdete tam kontakty, nadpisy, popisy služieb, časté otázky, referencie aj čísla
v štatistikách.

### Čísla v štatistikách

V `site.ts` v sekcii `stats`. Položky označené `confirmed: false` pochádzajú zo
starého webu a **treba ich aktualizovať**:

| Údaj | Stav |
|---|---|
| Rokov na trhu | ✅ počíta sa automaticky z roku 1996 — nikdy nezostarne |
| Spokojných klientov | ⚠️ `150` prevzaté zo starého webu, treba potvrdiť |
| Kvalifikovaných zamestnancov | ⚠️ `7` prevzaté zo starého webu, treba potvrdiť |
| Oblasti odbornosti | ✅ `4` — zodpovedá počtu služieb |

### Referencie

⚠️ **Aktuálne sú v sekcii „Referencie" zástupné texty**, mená klientov aj názvy
spoločností sú v hranatých zátvorkách (`[Meno klienta]`). Na webe je nad nimi
upozornenie pre správcu, ktoré uvidí aj návštevník.

Pred spustením webu buď:
- nahraďte ich **skutočnými referenciami so súhlasom klienta** (v `site.ts`)
  a nastavte `testimonialsArePlaceholders = false`, **alebo**
- celú sekciu odstráňte — v `src/App.tsx` zmažte riadok `<Testimonials />`
  a v `src/content/site.ts` položku `Referencie` zo zoznamu `nav`.

Vymyslené referencie na webe firmy sú klamlivá obchodná praktika
(zák. 250/2007 Z. z.), preto sú takto zvýraznené.

### Chýbajúce údaje

V `site.ts` sú prázdne a v pätičke sa nezobrazia, kým ich nedoplníte:
`ico`, `dic`, `icDph`, `openingHours`. PSČ je nastavené na `955 01` — overte ho.

### Fotografie

Zdrojové súbory sú v `src-images/`. Ak ich vymeníte (rovnaké názvy `about.jpg`
a `detail.jpg`), spustite:

```bash
npm run images     # vygeneruje avif/webp/jpg v 4 veľkostiach do public/img/
```

**Skutočné fotky kancelárie alebo tímu by fungovali lepšie než stockové.**
Licencie súčasných fotiek sú v [`CREDITS.md`](CREDITS.md).

### Logo a ikony

Logo je prekreslené do vektoru v `src/components/ui/Logo.tsx` (mení farbu podľa
kontextu). Favicon a ikony aplikácie vygenerujete z `public/favicon.svg`:

```bash
npm run icons
```

---

## Čo web zámerne nerobí

- **Nerobí žiadne požiadavky na tretie strany.** Fonty sú hosťované lokálne,
  mapa je nakreslená ako SVG. Žiadny Google Fonts, žiadne Google Maps, žiadne
  analytické nástroje.
- **Nenastavuje žiadne cookies** — preto nepotrebuje lištu so súhlasom.
- **Kontaktný formulár nemá server.** Otvorí e-mailový program návštevníka
  s predvyplnenou správou. Ak sa e-mailový program neotvorí, zobrazí sa
  náhradný panel s tlačidlom na skopírovanie správy a telefónnym číslom.

  **Dôsledok:** ak návštevník okno e-mailu zavrie, dopyt sa stratí a nedozviete
  sa o ňom. Ak by ste chceli garantované doručenie, najmenší krok je pridať na
  hosting jednoduchý `contact.php` — formulár je pripravený tak, aby sa dal
  prepojiť.

- Starý Google Analytics (`UA-120210959-1`) prestal fungovať už v roku 2023,
  preto sa neprenášal.

---

## Štruktúra

```
src/
├─ content/site.ts        ← všetok text (jediný súbor, ktorý bežne meníte)
├─ components/
│  ├─ layout/             Nav, MobileMenu, Footer, MobileActionBar
│  ├─ sections/           Hero, About, Stats, Services, Faq, Testimonials, CtaBand, Contact
│  ├─ ui/                 Button, Section, Reveal, Counter, Accordion, Logo, Picture, GradientMesh
│  └─ forms/              ContactForm, buildMailto
├─ hooks/                 useInView, useScrollSpy, useReducedMotion, useLockBodyScroll
└─ index.css              farby, písma, tiene, animácie (dizajnový systém)

scripts/
├─ optimize-images.mjs    npm run images
└─ make-icons.mjs         npm run icons
```
