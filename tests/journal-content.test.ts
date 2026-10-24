import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Les articles ne sont PAS bilingues par obligation : une locale peut avoir ses
// propres articles. On vérifie seulement la validité du frontmatter de chacun.
const locales = ['fr', 'en']

const listArticles = (locale: string): string[] => {
  const dir = fileURLToPath(new URL(`../content/journal/${locale}`, import.meta.url))
  return readdirSync(dir).filter(f => f.endsWith('.md'))
}

const frontmatter = (path: string): string => {
  const raw = readFileSync(path, 'utf-8')
  // Tolérant aux fins de ligne CRLF (certains articles en ont)
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match ? match[1].replace(/\r/g, '') : ''
}

describe('contenu du journal', () => {
  it('chaque locale a au moins un article', () => {
    for (const locale of locales) {
      expect(listArticles(locale).length, `aucun article pour ${locale}`).toBeGreaterThan(0)
    }
  })

  it('chaque article a un titre, une description et une date MM/DD/YYYY', () => {
    for (const locale of locales) {
      const dir = fileURLToPath(new URL(`../content/journal/${locale}`, import.meta.url))
      for (const file of listArticles(locale)) {
        const fm = frontmatter(`${dir}/${file}`)
        expect(fm, `${locale}/${file} : frontmatter absent`).toMatch(/^title:\s*\S/m)
        expect(fm, `${locale}/${file} : description absente`).toMatch(/^description:\s*\S/m)
        // Format ISO requis : le tri SQL reste chronologique, même entre années
        expect(fm, `${locale}/${file} : date absente ou hors format ISO YYYY-MM-DD`).toMatch(/^date:\s*'\d{4}-\d{2}-\d{2}'\s*$/m)
      }
    }
  })
})
