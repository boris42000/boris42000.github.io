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
  $$('.slider').forEach((slider) => {
    const track = $('.slider__track', slider)
    const prev = $('.slider__nav--prev', slider)
    const next = $('.slider__nav--next', slider)
    if (!track) return

    const originals = $$('.tile', track)

    // Not enough frames to fill the viewport: nothing to loop, hide the nav.
    if (originals.length === 0 || track.scrollWidth <= track.clientWidth + 4) {
      slider.classList.add('slider--static')
      return
    }

    // Infinite loop: flank the real strip with a clone set on each side and park the
    // viewport on the middle (real) copy. A clone button just re-fires its original,
    // so the lightbox keeps working without any re-wiring.
    const origBtns = originals.map((t) => $('.tile__btn', t))
    const origImgs = originals.map((t) => $('img.ph', t))
    const cloneImgs = origImgs.map(() => [])
    const cloneSet = () => originals.map((t, i) => {
      const c = t.cloneNode(true)
      c.setAttribute('aria-hidden', 'true')
      const b = $('.tile__btn', c)
      if (b) {
        b.tabIndex = -1
        b.removeAttribute('data-i')
        b.addEventListener('click', () => origBtns[i].click())
      }
      const img = $('img.ph', c)
      if (img) {
        cloneImgs[i].push(img)
        // A clone shares its original's URL, so once the original is in the clone
        // can show it with no fade of its own; otherwise let its own load flip it.
        if (origImgs[i]?.classList.contains('is-loaded') || (img.complete && img.naturalWidth)) {
          img.classList.add('is-loaded')
        } else {
          img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true })
        }
      }
      return c
    })
    cloneSet().forEach((c) => track.insertBefore(c, originals[0]))
    cloneSet().forEach((c) => track.appendChild(c))

    // When an original finishes later, flip its clones in the same moment so the
    // two copies never disagree as the roller wraps past them.
    origImgs.forEach((orig, i) => {
      if (!orig || (orig.complete && orig.naturalWidth)) return
      orig.addEventListener('load', () => {
        cloneImgs[i].forEach((c) => c.classList.add('is-loaded'))
      }, { once: true })
    })

    // Chrome deprioritises image decodes inside a horizontal scroller: after the
    // scroll position jumps (the initial park, a loop wrap, an arrow tween) tiles
    // can be left on a low-resolution raster that never upgrades until the next
    // interaction — the roller looks like it keeps "re-sharpening" the photos.
    // Force a full decode of everything in or next to the viewport whenever the
    // scroll settles.
    const decodeNear = () => {
      const w = track.clientWidth
      $$('img.ph', track).forEach((img) => {
        const r = img.getBoundingClientRect()
        if (r.right > -w && r.left < w * 2 && img.decode) img.decode().catch(() => {})
      })
    }

    // One segment = one copy of the strip. The three copies are pixel-identical, so
    // shifting the scroll position by a whole segment is invisible.
    const seg = () => track.scrollWidth / 3

    // Land any position on the middle copy, [seg, 2·seg). Everything writes scrollLeft
    // through here, so the roller can never reach a real scroll end — it just wraps.
    const place = (x) => {
      const s = seg()
      track.scrollLeft = s + (((x % s) + s) % s)
    }
    // Manual drag / trackpad / fling: fold back onto the middle copy once the
    // gesture settles. Rewriting scrollLeft on every raw `scroll` event fights the
    // scroll-snap engine and makes the wrap itself stutter, so mid-roller we wait
    // for `scrollend`; only a fling that gets within a viewport of a real edge is
    // wrapped in-flight, where there is still a whole clone copy of runway left.
    const refold = () => {
      const s = seg()
      if (track.scrollLeft < s) track.scrollLeft += s
      else if (track.scrollLeft >= 2 * s) track.scrollLeft -= s
    }
    const settle = () => { refold(); decodeNear() }
    // `scrollend` is not everywhere yet; a short idle timer is the fallback that
    // still fires the decode after a drag on browsers that lack it.
    let idle = 0
    const onScroll = () => {
      const edge = track.clientWidth
      if (track.scrollLeft < edge || track.scrollLeft > track.scrollWidth - edge) refold()
      clearTimeout(idle)
      idle = setTimeout(settle, 140)
    }
    track.scrollLeft = seg()
    decodeNear()
    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('scrollend', settle)
    addEventListener('resize', settle)

    // Animate by hand: the page's global `scroll-behavior: smooth` leaves a plain
    // `scrollBy` doing nothing here. A long duration, an ease and a modest step keep
    // the arrow a gentle nudge; `place` keeps the tween on the middle copy.
    const step = () => Math.max(track.clientWidth * 0.62, 240)
    let raf = 0
    const glide = (dir) => {
      cancelAnimationFrame(raf)
      refold()
      const start = track.scrollLeft - seg()
      const dist = dir * step()
      const dur = reduced.matches ? 0 : 900
      const t0 = performance.now()
      const tick = (t) => {
        const p = dur ? Math.min((t - t0) / dur, 1) : 1
        const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2
        place(start + dist * e)
        if (p < 1) raf = requestAnimationFrame(tick)
        else decodeNear()
      }
      raf = requestAnimationFrame(tick)
    }
    prev?.addEventListener('click', () => glide(-1))
    next?.addEventListener('click', () => glide(1))

    // A horizontal scroll container swallows the vertical mouse wheel (Chrome turns it
    // into a sideways nudge that scroll-snap then eats), so a wheel over the roller
    // neither moves it nor lets the page scroll past. Forward a vertical-dominant
    // wheel to the window; leave a horizontal gesture (trackpad) to scroll natively.
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return
      e.preventDefault()
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
      window.scrollBy({ top: e.deltaY * unit, behavior: 'instant' })
    }, { passive: false })
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
