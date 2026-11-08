// Portfolio — progressive enhancement only; the page is complete without it.
;(() => {
  const year = document.querySelector('[data-year]')
  if (year) year.textContent = new Date().getFullYear()

  /* ── Draggable stickers ─────────────────────────
     Each sticker keeps its CSS position (--x/--y) and is moved with a translate
     offset (--dx/--dy), clamped so it can't be dragged out of its box. */
  const box = document.querySelector('[data-stickers]')
  if (box) {
    box.querySelectorAll('.sticker').forEach((el) => {
      let startX = 0
      let startY = 0
      let baseX = 0
      let baseY = 0
      let limits = null

      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return
        el.setPointerCapture(e.pointerId)
        el.classList.add('is-dragging')
        box.classList.add('was-touched')
        startX = e.clientX
        startY = e.clientY
        baseX = parseFloat(el.style.getPropertyValue('--dx')) || 0
        baseY = parseFloat(el.style.getPropertyValue('--dy')) || 0
        const b = box.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        // how far the sticker may still travel in each direction from where it is now
        limits = {
          minX: baseX - (r.left - b.left),
          maxX: baseX + (b.right - r.right),
          minY: baseY - (r.top - b.top),
          maxY: baseY + (b.bottom - r.bottom),
        }
      })
      el.addEventListener('pointermove', (e) => {
        if (!el.hasPointerCapture(e.pointerId)) return
        const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
        el.style.setProperty('--dx', `${clamp(baseX + e.clientX - startX, limits.minX, limits.maxX)}px`)
        el.style.setProperty('--dy', `${clamp(baseY + e.clientY - startY, limits.minY, limits.maxY)}px`)
      })
      const drop = (e) => {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
        el.classList.remove('is-dragging')
      }
      el.addEventListener('pointerup', drop)
      el.addEventListener('pointercancel', drop)
    })
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    return
  }

  const revealer = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        en.target.classList.add('is-visible')
        revealer.unobserve(en.target)
      }),
    { rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el))

  // Touch screens have no hover: play the page-scroll preview while a project sits mid-screen.
  if (!matchMedia('(hover: hover)').matches) {
    const player = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.target.classList.toggle('is-active', en.isIntersecting)),
      { rootMargin: '-35% 0px -35% 0px' }
    )
    document.querySelectorAll('[data-work]').forEach((w) => player.observe(w))
  }
})()
