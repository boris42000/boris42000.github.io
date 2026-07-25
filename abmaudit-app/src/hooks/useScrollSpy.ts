import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently occupying the middle of the viewport.
 * IntersectionObserver-based — no scroll listeners anywhere on this site.
 */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!elements.length) return

    const visible = new Map<string, number>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }
        if (!visible.size) return
        // Whichever tracked section shows the most of itself wins.
        let best = ''
        let bestRatio = -1
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        if (best) setActive(best)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}
