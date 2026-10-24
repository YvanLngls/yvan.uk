import { describe, expect, it } from 'vitest'
import { formatDate } from '../app/utils/format-date'

describe('formatDate', () => {
  it('formate en français', () => {
    expect(formatDate('2026-10-14', 'fr')).toBe('14 octobre 2026')
  })

  it('formate en anglais (format US)', () => {
    expect(formatDate('2026-10-14', 'en')).toBe('October 14, 2026')
  })

  it('n’ajoute pas de zéro superflu aux jours et mois', () => {
    expect(formatDate('2026-01-05', 'fr')).toBe('5 janvier 2026')
  })

  it('renvoie la valeur brute si non parsable', () => {
    expect(formatDate('pas-une-date', 'fr')).toBe('pas-une-date')
  })
})
