import type { ChartDataset } from 'chart.js'

export type FormatType = 'pop' | 'gdp' | 'co2' | 'percent'

export interface WorldBankRecord {
  date: string
  value: number | null
  [key: string]: unknown
}

// La Banque mondiale répond sous la forme [meta, records]
export type WorldBankResponse = [unknown, WorldBankRecord[] | null] | null

// borderColor/backgroundColor sont resserrés en string : ce sont nos propres couleurs,
// ça évite de propager le type Chart.js dans les bindings de style du template
export interface MetricChartDataset extends ChartDataset<'line', number[]> {
  borderColor: string
  backgroundColor: string
}

export interface MetricInfo {
  translationKey: string
  formatType: FormatType
  latest: { value: string | number, year: string }
  chartData: {
    labels: string[]
    datasets: MetricChartDataset[]
  }
}

export const formatValue = (val: number | null | undefined, formatType: FormatType, isAxis = false): string | number => {
  if (val === null || val === undefined) return 'N/A'

  if (formatType === 'pop') {
    return (val / 1e9).toFixed(isAxis ? 1 : 2) + ' Md'
  }
  if (formatType === 'gdp') {
    return (val / 1e12).toFixed(isAxis ? 1 : 2) + ' Tn $'
  }
  if (formatType === 'co2') {
    if (isAxis) return (val / 1000).toFixed(1) + ' Gt'
    return (val / 1000).toFixed(2) + ' Gt CO₂e'
  }
  return val.toFixed(isAxis ? 0 : 1) + ' %'
}

// Transforme une réponse de l'API Banque mondiale en données prêtes pour Chart.js
export const processData = (apiResponse: WorldBankResponse | undefined, translationKey: string, color: string, formatType: FormatType): MetricInfo => {
  if (!apiResponse || !apiResponse[1]) {
    return { translationKey, chartData: { labels: [], datasets: [] }, latest: { value: 'N/A', year: '--' }, formatType }
  }

  const records = apiResponse[1].filter((r): r is WorldBankRecord & { value: number } => r.value !== null).reverse()
  const lastRecord = records[records.length - 1]
  const formattedValue = lastRecord ? formatValue(lastRecord.value, formatType, false) : 'N/A'

  return {
    translationKey,
    formatType,
    latest: { value: formattedValue, year: lastRecord ? lastRecord.date : '--' },
    chartData: {
      labels: records.map(r => r.date),
      datasets: [{
        data: records.map(r => r.value),
        borderColor: color,
        backgroundColor: color + '15',
        tension: 0.2, pointRadius: 0, pointHoverRadius: 4, fill: true
      }]
    }
  }
}
