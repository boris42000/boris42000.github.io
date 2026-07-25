/**
 * Bakes the rendered markup into dist/index.html.
 *
 * Without this nothing paints until ~80 KB of JS has downloaded and executed,
 * which is what holds back LCP on a throttled phone. It also means the page has
 * real content for crawlers and for anyone with JS blocked — the site is
 * readable even if the bundle never arrives.
 *
 * Runs after `vite build`; see the `build` script in package.json.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { build } from 'vite'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const SSR_OUT = '.ssr-tmp'

await build({
  logLevel: 'error',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: SSR_OUT,
    emptyOutDir: true,
    // The SSR bundle is a build-time artefact; don't hash or minify it.
    minify: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.js' } },
  },
})

const mod = await import(
  pathToFileURL(path.resolve(SSR_OUT, 'entry-server.js')).href
)
const html = await readFile('dist/index.html', 'utf8')
const markup = mod.render()

const out = html.replace(
  '<div id="root"></div>',
  `<div id="root">${markup}</div>`,
)

if (out === html) {
  console.error('prerender: could not find <div id="root"></div> in dist/index.html')
  process.exit(1)
}

await writeFile('dist/index.html', out)
await rm(SSR_OUT, { recursive: true, force: true })

console.log(`✓ prerendered (${(markup.length / 1024).toFixed(1)} kB of markup inlined)`)
