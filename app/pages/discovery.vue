<script setup lang="ts">
const { t, tm, rt } = useI18n()

const categories = computed(() => tm('discovery.categories'))

const discoveryList = computed(() => {
  const rawList = tm('discovery.list')
  return Object.values(rawList).map(item => ({
    name: rt(item.name),
    category: rt(item.category),
    url: rt(item.url),
    desc: rt(item.desc)
  }))
})

const getLinksByCat = (catKey: string) => {
  return discoveryList.value.filter(link => link.category === catKey)
}

// Ta variante d'animation habituelle
const transitionUp = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }
}

useHead({ title: t('nav_discovery') })

import { computed } from 'vue'

// 1. Requête vers l'API de la Banque Mondiale (Indicateur Population Mondiale)
// 'SP.POP.TOTL' est le code pour la population totale. '1W' correspond au monde entier.
const { data: rawData, pending, error } = await useFetch(
  'https://api.worldbank.org/v2/country/1W/indicator/SP.POP.TOTL?format=json&per_page=100'
)

// 2. Traitement des données pour extraire UNIQUEMENT la dernière valeur valide
const latestPopulation = computed(() => {
  if (!rawData.value || !rawData.value[1]) return null

  // L'API renvoie un tableau où l'index 1 contient la liste des années
  const records = rawData.value[1]

  // On cherche le premier enregistrement qui possède une valeur (l'année la plus récente)
  const latestRecord = records.find(record => record.value !== null)

  // CORRECTION ICI : On utilise bien 'latestRecord.date' au lieu de 'record.date'
  return latestRecord 
    ? { value: latestRecord.value, year: latestRecord.date } 
    : null
})

// Fonction utilitaire pour formater joliment les grands nombres (ex: 8 045 311 447 ou 8.05 Mrd)
const formatNumber = (num) => {
  if (!num) return ''
  return new Intl.NumberFormat('fr-FR').format(num)
}
</script>

<template>
  <div class="space-y-12">
    <!-- Header avec animation d'entrée -->
    <header v-motion v-bind="transitionUp" class="border-l-4 border-primary-500 pl-6 py-2">
      <h1 class="text-3xl font-black italic uppercase tracking-tighter text-white">
        {{ t('discovery.title') }}
      </h1>
      <p class="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">
        {{ t('discovery.description') }}
      </p>
    </header>

    <!-- Boucle sur les catégories -->
    <div v-for="(label, key, index) in categories" :key="key" class="space-y-6">
      <!-- Les titres de section apparaissent avec un léger décalage -->
      <div 
        v-motion
        :initial="{ opacity: 0, x: -10 }"
        :enter="{ opacity: 1, x: 0, transition: { delay: index * 100, duration: 400 } }"
        class="flex items-center gap-4"
      >
        <h2 class="text-primary-500 font-mono text-[10px] uppercase tracking-[0.4em] whitespace-nowrap">
          // {{ rt(label) }}
        </h2>
        <div class="h-px w-full bg-zinc-900"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          v-for="(link, linkIndex) in getLinksByCat(key)" 
          :key="rt(link.name)"
          v-motion
          :initial="{ opacity: 0, scale: 0.98 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: (index * 150) + (linkIndex * 50), duration: 400 } }"
          :href="link.url"
          target="_blank"
          class="group relative p-5 border border-zinc-900 bg-zinc-950/30 hover:bg-primary-500/5 transition-all duration-300 rounded-sm overflow-hidden"
        >
          <!-- Petit effet de coin au survol -->
          <div class="absolute top-0 right-0 w-8 h-8 bg-primary-500/10 translate-x-4 -translate-y-4 rotate-45 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"></div>

          <div class="flex flex-col h-full">
            <div class="flex justify-between items-start mb-3">
              <span class="text-white font-bold tracking-tight group-hover:text-primary-500 transition-colors uppercase italic">
                {{ rt(link.name) }}
              </span>
              <UIcon name="i-heroicons-arrow-up-right" class="text-zinc-700 group-hover:text-primary-500 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>

            <p class="text-sm text-zinc-500 leading-relaxed mb-4 flex-1 font-medium">
              {{ rt(link.desc) }}
            </p>

            <div class="flex items-center gap-2 mt-auto">
              <span class="text-[9px] font-mono text-primary-500/50 uppercase tracking-widest italic">Source:</span>
              <span class="text-[10px] font-mono text-zinc-600 truncate lowercase group-hover:text-zinc-400 transition-colors italic">
                {{ link.url.replace('https://', '').replace('www.', '') }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>

  <div class="card-dashboard">
    <h3>Population Mondiale</h3>
    
    <!-- État de chargement -->
    <div v-if="pending">Chargement des données mondiales...</div>
    
    <!-- En cas d'erreur -->
    <div v-else-if="error" class="error">Impossible de charger la donnée</div>
    
    <!-- Affichage du résultat -->
    <div v-else-if="latestPopulation" class="data-content">
      <p class="big-number">{{ formatNumber(latestPopulation.value) }}</p>
      <p class="subtext">Donnée officielle la plus récente (Banque Mondiale, {{ latestPopulation.year }})</p>
    </div>
  </div>
</template>