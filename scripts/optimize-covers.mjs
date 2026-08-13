/**
 * Generates the cover derivatives the site actually serves.
 *
 * `output: 'export'` means there is no server to resize images on request, so
 * every size has to exist as a file before `next build` copies public/ across.
 * Runs as `prebuild`; outputs are gitignored and regenerated from the source
 * cover, which stays untouched.
 */
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const blogImagesDir = path.join(process.cwd(), 'public/img/blog')

const sourceExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif']

/** Widths the templates ask for: list thumbnail, in-article cover, social card. */
const outputs = [
  { name: 'cover-320.webp', width: 320, format: 'webp', options: { quality: 72 } },
  { name: 'cover-1600.webp', width: 1600, format: 'webp', options: { quality: 78 } },
  // Social crawlers are the one place webp still isn't safe.
  { name: 'cover-og.jpg', width: 1200, format: 'jpeg', options: { quality: 80, mozjpeg: true } },
]

function findSource(dir) {
  for (const ext of sourceExtensions) {
    const file = path.join(dir, `cover.${ext}`)
    if (existsSync(file)) return file
  }
}

/** Skip work when every derivative is newer than the cover it came from. */
async function isUpToDate(source, dir) {
  const sourceTime = (await fs.stat(source)).mtimeMs
  for (const { name } of outputs) {
    const target = path.join(dir, name)
    if (!existsSync(target)) return false
    if ((await fs.stat(target)).mtimeMs < sourceTime) return false
  }
  return true
}

async function optimize(slug) {
  const dir = path.join(blogImagesDir, slug)
  const source = findSource(dir)
  if (!source) return null

  if (await isUpToDate(source, dir)) {
    return { slug, skipped: true }
  }

  const sourceBytes = (await fs.stat(source)).size
  const bytes = {}

  for (const { name, width, format, options } of outputs) {
    const target = path.join(dir, name)
    await sharp(source)
      // withoutEnlargement keeps a small source from being upscaled into a blur.
      .resize({ width, withoutEnlargement: true })
      .toFormat(format, options)
      .toFile(target)
    bytes[name] = (await fs.stat(target)).size
  }

  // Only ever one size per page, so report those rather than their sum.
  return {
    slug,
    sourceBytes,
    fullBytes: bytes['cover-1600.webp'],
    thumbBytes: bytes['cover-320.webp'],
  }
}

const kb = (bytes) => `${Math.round(bytes / 1024)}kb`

const slugs = await fs.readdir(blogImagesDir)
const results = (await Promise.all(slugs.map(optimize))).filter(Boolean)

let totalThumbs = 0

for (const result of results) {
  if (result.skipped) {
    console.log(`  = ${result.slug} (up to date)`)
    continue
  }
  totalThumbs += result.thumbBytes
  console.log(
    `  + ${result.slug}: ${kb(result.sourceBytes)} -> ${kb(result.fullBytes)} in-article, ` +
      `${kb(result.thumbBytes)} thumbnail`
  )
}

if (totalThumbs > 0) {
  console.log(`post list loads ${kb(totalThumbs)} of thumbnails`)
}
