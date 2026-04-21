import sharp from 'sharp'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const source = resolve(root, 'public/favicon-source.png')

const NAVY = { r: 20, g: 48, b: 77, alpha: 1 }

async function build({ size, padding, radius, outPath }) {
  // Rounded-corner mask as an SVG.
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>` +
      `</svg>`,
  )

  // Base: solid navy square.
  const base = await sharp({
    create: { width: size, height: size, channels: 4, background: NAVY },
  })
    .png()
    .toBuffer()

  // Logo: resize to fit inside padded square while keeping aspect.
  const logoSize = size - padding * 2
  const logo = await sharp(source)
    .resize({
      width: logoSize,
      height: logoSize,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()

  const logoMeta = await sharp(logo).metadata()

  // Composite logo onto navy, centered.
  const composed = await sharp(base)
    .composite([
      {
        input: logo,
        left: Math.round((size - (logoMeta.width ?? logoSize)) / 2),
        top: Math.round((size - (logoMeta.height ?? logoSize)) / 2),
      },
    ])
    .png()
    .toBuffer()

  // Apply rounded-corner mask.
  const final = await sharp(composed)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()

  writeFileSync(outPath, final)
  console.log(`wrote ${outPath} (${final.length} bytes)`)
}

async function main() {
  if (!existsSync(source)) {
    console.error(`missing source: ${source}`)
    process.exit(1)
  }

  await build({
    size: 64,
    padding: 10,
    radius: 14,
    outPath: resolve(root, 'app/icon.png'),
  })
  await build({
    size: 180,
    padding: 26,
    radius: 40,
    outPath: resolve(root, 'app/apple-icon.png'),
  })

  // Remove the old SVG placeholders so Next.js only serves the PNGs.
  for (const f of ['app/icon.svg', 'app/apple-icon.svg']) {
    const p = resolve(root, f)
    if (existsSync(p)) {
      unlinkSync(p)
      console.log(`removed ${f}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
