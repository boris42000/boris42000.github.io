import { Logo } from './Logo'

/**
 * Hero backdrop. Layered back-to-front:
 *   1. deep navy base gradient
 *   2. three blurred colour blobs drifting on transform-only keyframes
 *   3. a thin-line column motif quoting the logo's skyline geometry
 *   4. a faint 1px grid
 * Grain is applied by the parent's `.grain` class. Nothing here is a network request.
 */
export function GradientMesh() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[linear-gradient(168deg,#0f2e4a_0%,#0b1b2b_58%,#08131f_100%)]" />

      {/* Drifting blobs. Pre-blurred layers whose opacity/transform is animated —
          never `filter: blur()` inside a keyframe. */}
      <div className="blob blob-a absolute -left-[15%] -top-[25%] size-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,#1c5c93_0%,transparent_65%)] opacity-70 blur-[60px]" />
      <div className="blob blob-b absolute -right-[12%] top-[2%] size-[62vw] max-w-[820px] rounded-full bg-[radial-gradient(circle,#2e7dbe_0%,transparent_62%)] opacity-45 blur-[70px]" />
      <div className="blob blob-c absolute -bottom-[28%] left-[28%] size-[58vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,#7e5c1f_0%,transparent_60%)] opacity-40 blur-[80px]" />

      {/* Column / bar-chart motif — the logo's own geometry, used as texture. */}
      <svg
        className="absolute bottom-0 right-0 hidden h-[72%] w-auto opacity-[0.07] md:block"
        viewBox="0 0 520 400"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      >
        {[
          [20, 150],
          [80, 250],
          [140, 90],
          [200, 320],
          [260, 190],
          [320, 280],
          [380, 130],
          [440, 230],
        ].map(([x, h]) => (
          <path key={x} d={`M${x} 400 V${400 - h + 22} A22 22 0 0 1 ${x + 44} ${400 - h + 22} V400`} />
        ))}
      </svg>

      {/* Hairline grid, fading toward the centre so it never competes with the type. */}
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,transparent_25%,#000_85%)]" />

      {/* Oversized monogram watermark. */}
      <Logo
        withWordmark={false}
        title=""
        className="absolute -right-[6%] top-[8%] hidden h-[62%] text-white/[0.045] lg:block"
      />
    </div>
  )
}
