import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * The fonts are declared inside the bundled stylesheet, so the browser can't
 * discover them until the CSS has downloaded and parsed — which puts them on a
 * three-hop critical path ahead of the hero headline (the LCP element).
 * Preloading the two Latin faces removes a hop. Their filenames are content
 * hashed, so the tags have to be injected after the bundle is emitted.
 */
function preloadFonts(): Plugin {
  return {
    name: 'preload-latin-fonts',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const fonts = Object.keys(ctx.bundle ?? {}).filter(
          (f) => f.endsWith('.woff2') && /-latin-/.test(f) && !/-latin-ext-/.test(f),
        )
        const tags = fonts
          .map(
            (f) =>
              `<link rel="preload" href="./${f}" as="font" type="font/woff2" crossorigin>`,
          )
          .join('\n    ')
        return tags ? html.replace('</head>', `  ${tags}\n  </head>`) : html
      },
    },
  }
}

// Relative base is mandatory: the build is uploaded over FTP and must work
// whether it lands in the webroot or in a subdirectory.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: {
    target: 'es2020',
    // One small stylesheet beats extra round-trips on 4G.
    cssCodeSplit: false,
  },
})
