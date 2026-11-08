// VIDON očné centrum — progressive enhancement only; the page is complete without this file.
;(() => {
  const $ = (s, root = document) => root.querySelector(s)
  const $$ = (s, root = document) => [...root.querySelectorAll(s)]

  /* ── Mobile nav ─────────────────────────────── */
  const nav = $('[data-nav]')
  const toggle = $('[data-nav-toggle]')
  const setNav = (open) => {
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
  }
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')))
  nav.addEventListener('click', (e) => e.target.closest('a') && setNav(false))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false)
      toggle.focus()
    }
  })
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !e.target.closest('[data-header]')) setNav(false)
  })

  /* ── Header shadow once scrolled ────────────── */
  const header = $('[data-header]')
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ── Highlight today in the booking hours ───── */
  const today = new Date().getDay() // 0 = Sunday
  $$('[data-hours] li').forEach((li) => {
    if (li.dataset.days.split(' ').includes(String(today))) li.classList.add('is-today')
  })

  /* ── Footer year ────────────────────────────── */
  const year = $('[data-year]')
  if (year) year.textContent = new Date().getFullYear()

  if ('IntersectionObserver' in window) {
    /* ── Reveal on scroll ───────────────────────── */
    const revealer = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible')
            revealer.unobserve(en.target)
          }
        }),
      // A fixed, small margin: a percentage of a tall viewport can exceed the space left
      // below the last section, so it would never reveal.
      { rootMargin: '0px 0px -40px 0px' }
    )
    $$('.reveal').forEach((el) => revealer.observe(el))

    /* ── Mobile call bar: hide while the hero (with its own call button) is visible ── */
    const callBar = $('.call-bar')
    const hero = $('.hero')
    // Compare the ratio, not isIntersecting: crossing the 0.25 threshold downwards still
    // reports isIntersecting=true (24% is "intersecting"), and no further event follows.
    new IntersectionObserver(([en]) => callBar.classList.toggle('is-hidden', en.intersectionRatio >= 0.25), {
      threshold: 0.25,
    }).observe(hero)

    /* ── Scroll-spy for the nav ─────────────────── */
    const links = new Map($$('.nav a').map((a) => [a.hash.slice(1), a]))
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          links.forEach((a) => a.removeAttribute('aria-current'))
          links.get(en.target.id)?.setAttribute('aria-current', 'true')
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach((_, id) => {
      const section = document.getElementById(id)
      if (section) spy.observe(section)
    })
  } else {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'))
  }

  /* ── Price list: search + category filter ───── */
  const table = $('[data-prices]')
  const search = $('[data-price-search]')
  const chips = $$('[data-price-chips] .chip')
  const empty = $('[data-price-empty]')
  // Diacritic-insensitive: "sosovka" finds "šošovka", "katarakta" finds "Katarakty".
  const fold = (s) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
  const groups = $$('tbody', table).map((tbody) => ({
    tbody,
    id: tbody.dataset.group,
    rows: $$('tr:not(.price-group)', tbody).map((tr) => ({ tr, text: fold(tr.textContent) })),
  }))
  let activeGroup = ''

  const apply = () => {
    const terms = fold(search.value).split(/\s+/).filter(Boolean)
    let shown = 0
    groups.forEach((g) => {
      const groupOn = !activeGroup || g.id === activeGroup
      let inGroup = 0
      g.rows.forEach((r) => {
        const on = groupOn && terms.every((t) => r.text.includes(t))
        r.tr.hidden = !on
        if (on) inGroup++
      })
      g.tbody.hidden = inGroup === 0
      shown += inGroup
    })
    empty.hidden = shown > 0
  }

  search.addEventListener('input', apply)
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      activeGroup = chip.dataset.group
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)))
      apply()
    })
  )
})()
