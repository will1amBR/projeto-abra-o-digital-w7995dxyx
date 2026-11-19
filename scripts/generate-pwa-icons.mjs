/**
 * Script standalone: gera os PNGs de ícone do PWA em public/icons/.
 * Uso: node scripts/generate-pwa-icons.mjs
 *
 * Sem dependências externas: rasterizador próprio (blocos da identidade
 * oficial A-B-R-A-Ç-O em fonte pixel 3x5) + PNG escrito com zlib nativo.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '..', 'public', 'icons')

const BRAND = {
  rosa: [0xed, 0x0e, 0x58],
  roxo: [0x8d, 0x19, 0x8f],
  azul: [0x2e, 0x31, 0x92],
  ciano: [0x01, 0xab, 0xb7],
  verde: [0xcc, 0xe3, 0x10],
  laranja: [0xf8, 0x9c, 0x0e],
  branco: [0xff, 0xff, 0xff],
}

const GLYPHS = {
  A: ['111', '101', '111', '101', '101'],
  B: ['110', '101', '110', '101', '110'],
  R: ['110', '101', '110', '101', '101'],
  O: ['111', '101', '101', '101', '111'],
  Ç: ['111', '100', '100', '100', '111'],
}
const CEDILLA_CELLS = [[1, 5]]
const BLOCK_COLORS = ['rosa', 'roxo', 'azul', 'ciano', 'verde', 'laranja']
const BLOCK_LETTERS = ['A', 'B', 'R', 'A', 'Ç', 'O']

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(pixels, size) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const raw = Buffer.alloc(size * (size * 3 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixels[y * size + x]
      const o = y * (size * 3 + 1) + 1 + x * 3
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function insideRoundedRect(x, y, rx, ry, rw, rh, rad) {
  if (x < rx || x >= rx + rw || y < ry || y >= ry + rh) return false
  const cx = Math.max(rx + rad, Math.min(x, rx + rw - rad))
  const cy = Math.max(ry + rad, Math.min(y, ry + rh - rad))
  return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad
}

function renderIcon(size, maskable = false) {
  const pixels = new Array(size * size)
  const S = 2
  const canvas = 512
  const zoom = maskable ? 0.78 : 1

  const bw = 128
  const bh = 128
  const gap = 18
  const gridW = 3 * bw + 2 * gap
  const gridH = 2 * bh + gap
  const originX = (canvas - gridW) / 2
  const originY = (canvas - gridH) / 2

  const cell = 22
  const letterW = 3 * cell
  const letterH = 5 * cell

  const drawLetter = (letter, blockCx, blockCy) => {
    const rows = GLYPHS[letter]
    const x0 = blockCx - letterW / 2
    const y0 = blockCy - letterH / 2
    const cells = []
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 3; c++) if (rows[r][c] === '1') cells.push([c, r])
    if (letter === 'Ç') CEDILLA_CELLS.forEach(([c, r]) => cells.push([c, r]))
    return cells.map(([c, r]) => [x0 + c * cell, y0 + r * cell])
  }

  const blocks = BLOCK_LETTERS.map((letter, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const bx = originX + col * (bw + gap)
    const by = originY + row * (bh + gap)
    return {
      x: bx,
      y: by,
      w: bw,
      h: bh,
      rad: 20,
      color: BRAND[BLOCK_COLORS[i]],
      cells: drawLetter(letter, bx + bw / 2, by + bh / 2),
    }
  })

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0
      let g = 0
      let b = 0
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const x = ((px + (sx + 0.5) / S) / size) * canvas
          const y = ((py + (sy + 0.5) / S) / size) * canvas
          const dx = (x - canvas / 2) / zoom + canvas / 2
          const dy = (y - canvas / 2) / zoom + canvas / 2
          let col = BRAND.branco
          for (const blk of blocks) {
            if (!insideRoundedRect(dx, dy, blk.x, blk.y, blk.w, blk.h, blk.rad)) continue
            col = blk.color
            for (const [cx, cy] of blk.cells) {
              if (dx >= cx && dx < cx + cell && dy >= cy && dy < cy + cell) {
                col = BRAND.branco
                break
              }
            }
            break
          }
          r += col[0]
          g += col[1]
          b += col[2]
        }
      }
      pixels[py * size + px] = [
        Math.round(r / (S * S)),
        Math.round(g / (S * S)),
        Math.round(b / (S * S)),
      ]
    }
  }
  return encodePng(pixels, size)
}

fs.mkdirSync(OUT, { recursive: true })
const targets = [
  ['pwa-192.png', 192, false],
  ['pwa-512.png', 512, false],
  ['pwa-maskable-192.png', 192, true],
  ['pwa-maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, false],
]
for (const [name, size, maskable] of targets) {
  fs.writeFileSync(path.join(OUT, name), renderIcon(size, maskable))
  console.log(`✓ ${name} (${size}x${size}${maskable ? ', maskable' : ''})`)
}
console.log('Ícones PWA gerados em', OUT)
