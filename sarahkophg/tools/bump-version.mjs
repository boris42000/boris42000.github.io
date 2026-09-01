/**
 * Stamps index.html's styles.css/main.js links with a content-hash query string, so
 * a deploy is never served against a browser's (or GitHub Pages' CDN) cached copy of
 * the old file. Run after any edit to styles.css or main.js — `npm run page` and
 * `npm run build` already chain this in, so a normal `npm run page` stays correct;
 * reach for `npm run version` on its own when you only touched CSS/JS and the photo
 * set didn't change.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(HERE, '..')

const hash = async (file) => {
  const buf = await readFile(path.join(ROOT, file))
  return createHash('sha1').update(buf).digest('hex').slice(0, 8)
}

const [cssV, jsV] = await Promise.all([hash('styles.css'), hash('main.js')])

const indexPath = path.join(ROOT, 'index.html')
let html = await readFile(indexPath, 'utf8')
html = html.replace(/href="styles\.css(?:\?v=[a-f0-9]+)?"/, `href="styles.css?v=${cssV}"`)
html = html.replace(/src="main\.js(?:\?v=[a-f0-9]+)?"/, `src="main.js?v=${jsV}"`)
await writeFile(indexPath, html)

console.log(`styles.css -> ?v=${cssV}`)
console.log(`main.js    -> ?v=${jsV}`)
