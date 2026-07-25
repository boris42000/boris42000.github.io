import { images, type ImageName } from '../../assets/images'
import { cn } from '../../lib/cn'

const WIDTHS = [480, 768, 1120, 1600] as const

/**
 * Responsive <picture> with avif → webp → jpg fallbacks.
 *
 * Width/height always come from the generated manifest, so every image reserves
 * its box before it loads and contributes zero CLS.
 */
export function Picture({
  name,
  alt,
  sizes,
  className,
  priority = false,
}: {
  name: ImageName
  alt: string
  sizes: string
  className?: string
  /** Use for the first image below the fold — lazy-loading it just delays it. */
  priority?: boolean
}) {
  const meta = images[name]
  const srcset = (ext: string) =>
    WIDTHS.filter((w) => w <= meta.width)
      .map((w) => `./img/${name}-${w}.${ext} ${w}w`)
      .join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`./img/${name}-1120.jpg`}
        srcSet={srcset('jpg')}
        sizes={sizes}
        alt={alt}
        width={meta.width}
        height={meta.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn(className)}
      />
    </picture>
  )
}
