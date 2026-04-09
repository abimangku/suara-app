import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { VOCAB_LIST } from './vocab-list'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ASSETS_DIR = join(__dirname, '..', 'assets', 'symbols')
const ARASAAC_SEARCH_URL = 'https://api.arasaac.org/v1/pictograms/en/search'
const ARASAAC_IMAGE_URL = 'https://static.arasaac.org/pictograms'

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function downloadSymbol(keyword: string): Promise<Buffer | null> {
  try {
    const searchRes = await fetch(
      `${ARASAAC_SEARCH_URL}/${encodeURIComponent(keyword)}`
    )
    if (!searchRes.ok) {
      console.warn(`  ⚠ Search failed for "${keyword}": ${searchRes.status}`)
      return null
    }
    const results = (await searchRes.json()) as Array<{ _id: number }>
    if (!Array.isArray(results) || results.length === 0) {
      console.warn(`  ⚠ No results for "${keyword}"`)
      return null
    }

    const pictoId = results[0]._id

    const imageRes = await fetch(
      `${ARASAAC_IMAGE_URL}/${pictoId}/${pictoId}_500.png`
    )
    if (!imageRes.ok) {
      console.warn(
        `  ⚠ Image download failed for "${keyword}" (id: ${pictoId}): ${imageRes.status}`
      )
      return null
    }
    const buffer = Buffer.from(await imageRes.arrayBuffer())
    return buffer
  } catch (err) {
    console.warn(`  ⚠ Error downloading "${keyword}":`, err)
    return null
  }
}

async function main() {
  const coreDir = join(ASSETS_DIR, 'core')
  const fringeDir = join(ASSETS_DIR, 'fringe')
  if (!existsSync(coreDir)) mkdirSync(coreDir, { recursive: true })
  if (!existsSync(fringeDir)) mkdirSync(fringeDir, { recursive: true })

  console.log(
    `\n🔍 Downloading ARASAAC symbols for ${VOCAB_LIST.length} words...\n`
  )

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const item of VOCAB_LIST) {
    if (item.source !== 'arasaac') {
      console.log(`  ⏭ ${item.id} (${item.source}) — skipped`)
      skipped++
      continue
    }

    const outDir = item.category === 'core' ? coreDir : fringeDir
    const outPath = join(outDir, `${item.id}.png`)

    if (existsSync(outPath)) {
      console.log(`  ✓ ${item.id} — already exists`)
      downloaded++
      continue
    }

    console.log(`  ↓ ${item.id} (keyword: "${item.arasaacKeyword}")...`)
    const buffer = await downloadSymbol(item.arasaacKeyword)
    if (buffer) {
      writeFileSync(outPath, buffer)
      console.log(
        `  ✅ ${item.id} — saved (${(buffer.length / 1024).toFixed(1)} KB)`
      )
      downloaded++
    } else {
      failed++
    }

    await sleep(200)
  }

  console.log(`\n📊 Summary:`)
  console.log(`  Downloaded: ${downloaded}`)
  console.log(`  Skipped (ai_gen/family_photo): ${skipped}`)
  console.log(`  Failed: ${failed}`)
  console.log(`\nDone!\n`)
}

main().catch(console.error)
