import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const load = (name: string): Record<string, unknown> => JSON.parse(
  readFileSync(fileURLToPath(new URL(`../i18n/locales/${name}.json`, import.meta.url)), 'utf-8')
)

const flatten = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  )

describe('locales i18n', () => {
  const fr = flatten(load('fr'))
  const en = flatten(load('en'))

  // Exemption : les listes de compétences du CV (about.skills) ont des longueurs
  // différentes entre le FR et l'EN — à retirer quand les deux CV seront alignés
  const withoutCvSkills = (keys: string[]) => keys.filter(k => !k.startsWith('about.skills.'))

  it('couvre les mêmes clés en français et en anglais', () => {
    expect(withoutCvSkills(en).sort()).toEqual(withoutCvSkills(fr).sort())
  })
})
