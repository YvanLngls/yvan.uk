<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const { t } = useI18n()
const selectedMetric = ref(null)

// 1. Appels en parallèle des 8 API de la Banque Mondiale
const [
  { data: popData },
  { data: gdpData },
  { data: co2Data },
  { data: netData },
  { data: inflData },
  { data: rateData },
  { data: unempData },
  { data: activeData }
] = await Promise.all([
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/SP.POP.TOTL?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/NY.GDP.MKTP.KD?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/EN.GHG.CO2.MT.CE.AR5?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/IT.NET.USER.ZS?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/NY.GDP.DEFL.KD.ZG?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/SL.UEM.TOTL.ZS?format=json&per_page=100'),
  useFetch('https://api.worldbank.org/v2/country/1W/indicator/SL.TLF.CACT.ZS?format=json&per_page=100')
])

// Fonction de formatage globale partagée
const formatValue = (val, formatType, isAxis = false) => {
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
  if (formatType === 'percent') {
    return val.toFixed(isAxis ? 0 : 1) + ' %'
  }
  return val
}

// Fonction générique de traitement et formatage
const processData = (apiResponse, translationKey, color, formatType) => {
  if (!apiResponse || !apiResponse[1]) {
    return { translationKey, chartData: { labels: [], datasets: [] }, latest: { value: 'N/A', year: '--' }, formatType }
  }
  
  const records = apiResponse[1].filter(r => r.value !== null).reverse()
  const lastRecord = records[records.length - 1]
  const formattedValue = lastRecord ? formatValue(lastRecord.value, formatType, false) : 'N/A'

  return {
    translationKey, // On stocke la CLÉ i18n (ex: 'world-data.metrics.pop')
    formatType,
    latest: { value: formattedValue, year: lastRecord ? lastRecord.date : '--' },
    chartData: {
      labels: records.map(r => r.date),
      datasets: [{
        // Le label est généré dynamiquement via une fonction pour réactivité
        translationKey: translationKey, 
        data: records.map(r => r.value),
        borderColor: color,
        backgroundColor: color + '15',
        tension: 0.2, pointRadius: 0, pointHoverRadius: 4, fill: true
      }]
    }
  }
}

// Générateur d'options réactif pour Chart.js (écoute le changement de langue)
const getChartOptions = (info, isZoomed = false) => {
  const commonTicks = { color: '#a6adc8', font: { family: 'monospace', size: 10 } }
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: isZoomed, // Affiche la légende de Chart.js uniquement en zoom
        position: 'bottom',
        labels: { 
          color: '#cdd6f4',
          font: { size: 12 },
          generateLabels: (chart) => {
            // 1. On récupère les labels générés automatiquement par Chart.js
            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            
            // 2. On change juste le texte avec la traduction i18n
            if (original && original.length) {
              original[0].text = t(info.translationKey);
            }
            return original;
          }
        }
      } 
    },
    scales: {
      x: { grid: { display: false }, ticks: { ...commonTicks, maxTicksLimit: isZoomed ? 15 : 6 } },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.03)' }, 
        ticks: { 
          ...commonTicks,
          font: { size: isZoomed ? 12 : 10 },
          callback: function(value) { return formatValue(value, info.formatType, true) }
        } 
      }
    }
  }
}

const openZoom = (metric) => {
  if (metric.chartData.labels.length > 0) {
    selectedMetric.value = metric
    document.body.style.overflow = 'hidden'
  }
}

const closeZoom = () => {
  selectedMetric.value = null
  document.body.style.overflow = ''
}

// Création des datasets via computed (avec les clés i18n)
const popInfo = computed(() => processData(popData.value, 'world-data.metrics.pop', '#42b883', 'pop'))
const gdpInfo = computed(() => processData(gdpData.value, 'world-data.metrics.gdp', '#f38ba8', 'gdp'))
const co2Info = computed(() => processData(co2Data.value, 'world-data.metrics.co2', '#fab387', 'co2'))
const netInfo = computed(() => processData(netData.value, 'world-data.metrics.net', '#89b4fa', 'percent'))

const inflInfo = computed(() => processData(inflData.value, 'world-data.metrics.infl', '#f9e2af', 'percent'))
const rateInfo = computed(() => processData(rateData.value, 'world-data.metrics.rate', '#cba6f7', 'percent'))
const unempInfo = computed(() => processData(unempData.value, 'world-data.metrics.unemp', '#f38ba8', 'percent'))
const activeInfo = computed(() => processData(activeData.value, 'world-data.metrics.active', '#94e2d5', 'percent'))
</script>

<template>
  <div class="py-4 text-[#cdd6f4] bg-transparent">
    <header class="mb-12">
      <h2 class="m-0 text-3xl font-extrabold tracking-tighter text-white uppercase">{{ $t('world-data.title') }}</h2>
      <p class="mt-1.5 text-sm font-mono text-[#a6adc8]">{{ $t('world-data.subtitle') }}</p>
    </header>

    <!-- SECTION 1 -->
    <section class="mb-14">
      <h3 class="pb-2 mb-6 font-mono text-sm tracking-widest text-[#1aff80] uppercase border-b border-dashed border-white/10">
        // {{ $t('world-data.section_env') }}
      </h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div 
          v-for="(info, index) in [popInfo, gdpInfo, co2Info, netInfo]" 
          :key="'env-' + index" 
          @click="openZoom(info)"
          class="flex flex-col p-5 bg-[#0d0d11] border border-[#1e1e2e] rounded shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-white/10"
        >
          <div class="mb-2">
            <span class="flex items-center gap-2 font-mono text-sm font-semibold text-[#cdd6f4]">
              <span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ backgroundColor: info.chartData.datasets?.[0]?.borderColor }"></span>
              {{ $t(info.translationKey) }}
            </span>
          </div>
          <div class="relative w-full h-44">
            <Line v-if="info.chartData.labels.length" :data="info.chartData" :options="getChartOptions(info, false)" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-3 pt-3 border-t border-dashed border-white/5">
            <span class="font-mono text-xl font-bold" :style="{ color: info.chartData.datasets?.[0]?.borderColor }">{{ info.latest.value }}</span>
            <span class="font-mono text-xs text-[#a6adc8]">{{ $t('world-data.in_year', { year: info.latest.year }) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 -->
    <section class="mb-14">
      <h3 class="pb-2 mb-6 font-mono text-sm tracking-widest text-[#1aff80] uppercase border-b border-dashed border-white/10">
        // {{ $t('world-data.section_econ') }}
      </h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div 
          v-for="(info, index) in [inflInfo, rateInfo, unempInfo, activeInfo]" 
          :key="'econ-' + index" 
          @click="openZoom(info)"
          class="flex flex-col p-5 bg-[#0d0d11] border border-[#1e1e2e] rounded shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-white/10"
        >
          <div class="mb-2">
            <span class="flex items-center gap-2 font-mono text-sm font-semibold text-[#cdd6f4]">
              <span class="w-2.5 h-2.5 rounded-full inline-block" :style="{ backgroundColor: info.chartData.datasets?.[0]?.borderColor }"></span>
              {{ $t(info.translationKey) }}
            </span>
          </div>
          <div class="relative w-full h-44">
            <Line v-if="info.chartData.labels.length" :data="info.chartData" :options="getChartOptions(info, false)" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-3 pt-3 border-t border-dashed border-white/5">
            <span class="font-mono text-xl font-bold" :style="{ color: info.chartData.datasets?.[0]?.borderColor }">{{ info.latest.value }}</span>
            <span class="font-mono text-xs text-[#a6adc8]">{{ $t('world-data.in_year', { year: info.latest.year }) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- OVERLAY DE ZOOM -->
    <transition 
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="selectedMetric" @click.self="closeZoom" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <div class="relative flex flex-col w-full max-w-5xl p-6 bg-[#0d0d11] border border-[#1e1e2e] rounded-lg shadow-2xl h-[80vh] md:p-8">
          
          <button @click="closeZoom" class="absolute text-3xl top-4 right-6 text-[#a6adc8] hover:text-white transition-colors duration-150">&times;</button>
          
          <div class="flex flex-col justify-between gap-2 pb-4 mb-6 border-b border-white/5 sm:flex-row sm:items-center">
            <h3 class="flex items-center gap-3 font-mono text-xl font-bold text-white">
              <span class="w-3 h-3 rounded-full inline-block" :style="{ backgroundColor: selectedMetric.chartData.datasets[0].borderColor }"></span>
              {{ $t(selectedMetric.translationKey) }}
            </h3>
            <div class="flex items-baseline gap-1.5">
              <span class="font-mono text-2xl font-bold md:text-3xl" :style="{ color: selectedMetric.chartData.datasets[0].borderColor }">{{ selectedMetric.latest.value }}</span>
              <span class="font-mono text-xs md:text-sm text-[#a6adc8]">{{ $t('world-data.in_year', { year: selectedMetric.latest.year }) }}</span>
            </div>
          </div>

          <div class="relative flex-grow w-full min-h-0">
            <Line :data="selectedMetric.chartData" :options="getChartOptions(selectedMetric, true)" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>