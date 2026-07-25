/**
 * Generates the favicon/app-icon set from public/favicon.svg.
 * Run with `npm run icons`.
 */
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'

const SVG = await readFile('public/favicon.svg')
const render = (size, opts = {}) =>
  sharp(SVG, { density: 512 }).resize(size, size, { fit: 'contain', ...opts }).png()

// Apple touch icons must be opaque — a transparent one renders black on iOS.
await render(180).flatten({ background: '#0b1b2b' }).toFile('public/apple-touch-icon.png')
await render(192).toFile('public/icon-192.png')
await render(512).toFile('public/icon-512.png')

// Maskable: 10% safe padding so Android's mask can't clip the mark.
await sharp(SVG, { density: 512 })
  .resize(410, 410, { fit: 'contain' })
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: '#0b1b2b' })
  .png()
  .toFile('public/icon-maskable-512.png')

/**
 * favicon.ico as a single 32×32 PNG payload. Sharp can't emit ICO, but the
 * container is trivial: a 6-byte ICONDIR + one 16-byte ICONDIRENTRY + the PNG.
 * Browsers and crawlers that still request /favicon.ico by default get a real
 * file instead of a 404.
 */
const png = await render(32).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // palette size
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(png.length, 14) // payload size
header.writeUInt32LE(22, 18) // payload offset
await writeFile('public/favicon.ico', Buffer.concat([header, png]))

console.log('✓ icons written to public/')
