/* Sarah Kop — čiernobiela fotografia. No dependencies. */
(() => {
  'use strict'

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')

  /* ── Footer year ───────────────────────────────────────────────────────── */
  const year = $('#year')
  if (year) year.textContent = String(new Date().getFullYear())

  /* ── Blur-up ───────────────────────────────────────────────────────────── */
  // `complete` catches images already cached by the time this runs.
  $$('img.ph').forEach((img) => {
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded')
    else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true })
    img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true })
  })

  /* ── Sticky header ─────────────────────────────────────────────────────── */
  const hdr = $('#hdr')
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('is-stuck', window.scrollY > 24)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ── Body scroll lock ──────────────────────────────────────────────────── */
  // Refcounted: the nav panel and the lightbox can both want the lock, and the
  // second one to close must not unlock while the first is still open.
  let locks = 0
  const lock = () => { if (++locks === 1) document.body.classList.add('is-locked') }
  const unlock = () => { if (locks > 0 && --locks === 0) document.body.classList.remove('is-locked') }

  /* ── Mobile nav ────────────────────────────────────────────────────────── */
  const toggle = $('#navToggle')
  const panel = $('#navPanel')
  if (toggle && panel) {
    const setNav = (open) => {
      panel.hidden = !open
      toggle.setAttribute('aria-expanded', String(open))
      $('.hdr__toggle-label', toggle).textContent = open ? 'Zavrieť' : 'Menu'
      if (open) { lock(); $('a', panel)?.focus() } else { unlock() }
    }
    toggle.addEventListener('click', () => setNav(panel.hidden))
    // Anchor links inside the panel must close it, or the target scrolls behind it.
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false) })
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) { setNav(false); toggle.focus() }
    })
    // Crossing into desktop leaves the panel hidden by CSS but still locked.
    matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
      if (e.matches && !panel.hidden) setNav(false)
    })
  }

  /* ── Mosaic tiles ──────────────────────────────────────────────────────── */
  const tiles = $$('.portfolio .tile')

  /* ── Lightbox ──────────────────────────────────────────────────────────── */
  const data = window.__GALLERY__ || []
  const lb = $('#lb')
  const lbImg = $('#lbImg')
  const lbNow = $('#lbNow')
  const lbTotal = $('#lbTotal')
  let order = []
  let pos = 0
  let opener = null

  const show = (i) => {
    pos = (i + order.length) % order.length
    const item = data[order[pos]]
    if (!item) return
    lbImg.src = item.src
    lbImg.alt = item.alt
    lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = item.fallback }
    if (lbNow) lbNow.textContent = String(pos + 1)
    if (lbTotal) lbTotal.textContent = String(order.length)
  }

  const open = (tile) => {
    order = tiles.map((t) => Number($('.tile__btn', t).dataset.i))
    const at = tiles.indexOf(tile)
    opener = $('.tile__btn', tile)
    show(at < 0 ? 0 : at)
    lb.hidden = false
    lock()
    $('#lbClose').focus()
  }

  const close = () => {
    lb.hidden = true
    lbImg.src = ''
    unlock()
    opener?.focus()
    opener = null
  }

  if (lb && lbImg) {
    tiles.forEach((tile) => {
      $('.tile__btn', tile).addEventListener('click', () => open(tile))
    })

    $('#lbClose').addEventListener('click', close)
    $('#lbPrev').addEventListener('click', () => show(pos - 1))
    $('#lbNext').addEventListener('click', () => show(pos + 1))
    // Backdrop and the empty area around the photo close it. The photo itself must
    // not, or a swipe that ends as a tap would dismiss instead of navigating.
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb__stage')) close()
    })

    addEventListener('keydown', (e) => {
      if (lb.hidden) return
      if (e.key === 'Escape') { e.preventDefault(); close() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(pos - 1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(pos + 1) }
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog while it's modal.
        const f = $$('button', lb)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    })

    // Swipe. Threshold guards against a tap being read as a flick.
    let x0 = null
    let y0 = null
    lb.addEventListener('touchstart', (e) => {
      x0 = e.changedTouches[0].clientX
      y0 = e.changedTouches[0].clientY
    }, { passive: true })
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(pos + (dx < 0 ? 1 : -1))
      x0 = y0 = null
    }, { passive: true })
  }

  /* ── Portfolio rollers ─────────────────────────────────────────────────── */
  // Driven by Embla Carousel (vendored, ~18 KB, no dependencies). It translates a
  // flex container instead of scripting `scrollLeft` on a scroll-snap scroller, which
  // is what the hand-rolled version did. That one change removes the three things
  // that made the old roller feel unreliable: the loop needs no DOM clones (Embla
  // repositions the real slides, so the lightbox indices stay untouched), there is
  // no scroll position to re-fold at the seam, and the track is no longer a scroll
  // container, so it cannot swallow the page's vertical wheel.
  const Embla = window.EmblaCarousel

  $$('.slider').forEach((slider) => {
    const viewport = $('.slider__track', slider)
    const prev = $('.slider__nav--prev', slider)
    const next = $('.slider__nav--next', slider)
    if (!viewport) return

    const slides = $$('.tile', viewport)
    // No Embla (blocked script, ancient browser) leaves the track as the native
    // scroller the CSS ships by default — degraded, but never broken.
    if (!Embla || !slides.length) return

    // Embla's shape is viewport > container > slides. The markup ships the slides as
    // direct children of the track so the no-JS scroller works; wrap them here.
    const container = document.createElement('div')
    container.className = 'slider__container'
    slides.forEach((s) => container.appendChild(s))
    viewport.appendChild(container)
    slider.classList.add('slider--embla')

    const embla = Embla(viewport, {
      loop: true,
      align: 'start',
      containScroll: false, // the loop wants the full strip, not clamped ends
      duration: reduced.matches ? 0 : 26,
      dragFree: false,
      inViewThreshold: 0.2,
    })

    // Hide the nav while every frame already fits — there is nothing to advance to.
    // Embla re-measures on resize, so re-run the check when it does.
    const sync = () => {
      const strip = slides.reduce((w, s) => w + s.getBoundingClientRect().width, 0)
      const fits = strip <= viewport.clientWidth + 4
      slider.classList.toggle('slider--static', fits)
      ;[prev, next].forEach((b) => { if (b) b.disabled = fits })
    }

    // Insurance against Chrome leaving a tile on a low-resolution raster after a
    // jump: decode everything in or beside the viewport once movement stops.
    const decodeNear = () => {
      const w = viewport.clientWidth
      $$('img.ph', container).forEach((img) => {
        const r = img.getBoundingClientRect()
        if (r.right > -w && r.left < w * 2 && img.decode) img.decode().catch(() => {})
      })
    }

    // `init` already fired inside the constructor above, so the first pass is a
    // direct call; Embla re-measures on resize and emits `reInit` for the rest.
    sync()
    decodeNear()
    embla.on('reInit', sync).on('reInit', decodeNear).on('settle', decodeNear)
    embla.on('pointerDown', () => slider.classList.add('slider--dragging'))
    embla.on('pointerUp', () => slider.classList.remove('slider--dragging'))

    prev?.addEventListener('click', () => embla.scrollPrev())
    next?.addEventListener('click', () => embla.scrollNext())

    // The track keeps its tabindex, but it is no longer a scroller, so the arrow
    // keys that used to move it natively have to be wired up.
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); embla.scrollPrev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); embla.scrollNext() }
    })

    // A drag that ends on a tile must not also open the lightbox. Measured from the
    // pointer itself rather than from Embla's `clickAllowed()`, which is not in every
    // build; the capture phase gets this in before the tile's own click handler.
    let dragFrom = null
    let dragged = false
    container.addEventListener('pointerdown', (e) => {
      dragFrom = { x: e.clientX, y: e.clientY }
      dragged = false
    })
    container.addEventListener('pointermove', (e) => {
      if (!dragFrom) return
      if (Math.hypot(e.clientX - dragFrom.x, e.clientY - dragFrom.y) > 8) dragged = true
    })
    container.addEventListener('click', (e) => {
      if (!dragged) return
      e.preventDefault()
      e.stopPropagation()
    }, true)
  })

  /* ── Reveal on scroll ──────────────────────────────────────────────────── */
  // The hero is deliberately not in here: it is the LCP, so it paints straight away.
  const targets = [
    ...$$('.slider, .banner, .contact__body'),
  ]
  targets.forEach((el) => el.classList.add('reveal'))

  if (!('IntersectionObserver' in window) || reduced.matches) {
    targets.forEach((el) => el.classList.add('is-in'))
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    targets.forEach((el) => io.observe(el))
  }
})()
