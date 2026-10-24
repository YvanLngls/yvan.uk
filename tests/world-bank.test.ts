import { describe, expect, it } from 'vitest'
import { formatValue, processData, type WorldBankRecord, type WorldBankResponse } from '../app/utils/world-bank'

const record = (date: string, value: number | null): WorldBankRecord => ({ date, value })

describe('formatValue', () => {
  it('retourne N/A sans valeur', () => {
    expect(formatValue(null, 'pop')).toBe('N/A')
    expect(formatValue(undefined, 'gdp')).toBe('N/A')
  })

  it('formate la population en milliards', () => {
    expect(formatValue(7_912_000_000, 'pop')).toBe('7.91 Md')
    expect(formatValue(7_912_000_000, 'pop', true)).toBe('7.9 Md')
  })

  it('formate le PIB en trillions', () => {
    expect(formatValue(85_000_000_000_000, 'gdp')).toBe('85.00 Tn $')
  })

  it('formate le CO2 en gigatonnes', () => {
    expect(formatValue(37_000, 'co2')).toBe('37.00 Gt CO₂e')
    expect(formatValue(37_000, 'co2', true)).toBe('37.0 Gt')
  })

  it('formate les pourcentages', () => {
    expect(formatValue(63.456, 'percent')).toBe('63.5 %')
    expect(formatValue(63.456, 'percent', true)).toBe('63 %')
  })
})

describe('processData', () => {
  it('gère une réponse vide ou indisponible', () => {
    const emptyResponses: WorldBankResponse[] = [null, undefined, [{}, null]]

    for (const response of emptyResponses) {
      const info = processData(response, 'key', '#fff', 'pop')
      expect(info.latest).toEqual({ value: 'N/A', year: '--' })
      expect(info.chartData.labels).toEqual([])
      expect(info.chartData.datasets).toEqual([])
    }
  })

  it('ignore les valeurs nulles et remet les années en ordre chronologique', () => {
    // L'API renvoie les années les plus récentes en premier
    const response: WorldBankResponse = [{}, [record('2022', 300), record('2021', null), record('2020', 100)]]

    const info = processData(response, 'key', '#ff0000', 'pop')

    expect(info.chartData.labels).toEqual(['2020', '2022'])
    expect(info.chartData.datasets[0]?.data).toEqual([100, 300])
    expect(info.chartData.datasets[0]?.borderColor).toBe('#ff0000')
  })

  it('expose la dernière valeur non nulle, formatée', () => {
    // Valeur réaliste : l'API renvoie la population absolue (~7,9 milliards)
    const response: WorldBankResponse = [{}, [record('2022', 7_912_000_000), record('2021', null)]]

    const info = processData(response, 'key', '#ff0000', 'pop')

    expect(info.latest).toEqual({ value: '7.91 Md', year: '2022' })
  })
})
