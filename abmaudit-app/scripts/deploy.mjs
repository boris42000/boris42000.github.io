/**
 * Copies dist/ into ../abmaudit — the folder GitHub Pages actually serves at
 * https://boris42000.github.io/abmaudit/, since this repo is a username.github.io
 * site with Pages configured to serve the master branch root as static files
 * (no build step runs on GitHub's side).
 *
 * Deletes the previous published output first: Vite content-hashes every
 * asset filename per build, so without this old JS/CSS/font files would
 * accumulate in the published folder forever.
 *
 * Run with `npm run deploy`, then `git add`, `commit`, and `push` from the
 * repo root — this script only touches the filesystem, never git.
 */
import { rm, cp, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC = 'dist'
const DEST = path.join('..', 'abmaudit')

if (!existsSync(SRC)) {
  console.error(`${SRC}/ not found — run \`npm run build\` first.`)
  process.exit(1)
}

await rm(DEST, { recursive: true, force: true })
await mkdir(DEST, { recursive: true })
await cp(SRC, DEST, { recursive: true })

console.log(`✓ copied ${SRC}/ → ${DEST}/`)
console.log('  Next: git add abmaudit abmaudit-app && git commit && git push')
