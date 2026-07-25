import type { ElementType, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'

/**
 * Scroll reveal. The observer only toggles a class — the animation itself is CSS,
 * so the main thread does almost nothing during scroll.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  /** ms. Callers pass index * 60 for a stagger; capped so late items don't drag. */
  delay?: number
  as?: ElementType
}) {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      className={cn('reveal', inView && 'is-in', className)}
      style={{ '--reveal-delay': `${Math.min(delay, 300)}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
