<script setup lang="ts">
const { locale, t } = useI18n()

// Helper pour générer le bon chemin de route (sans le dossier locale)
const getArticleRoute = (contentPath: string) => {
  return contentPath.replace(new RegExp(`^/journal/${locale.value}/`), '/journal/')
}

const { data: articles } = await useAsyncData(`journal-list-${locale.value}`, () => {
  return queryCollection('journal')
    // On ajoute le slash initial et on s'assure que la casse correspond
    .where('path', 'LIKE', `/journal/${locale.value}/%`)
    .all()
}, {
  watch: [locale]
})

const fullText = computed(() => t('journal.title'))
const displayedText = ref('')
const isDone = ref(false)

const typeWriter = () => {
  displayedText.value = ''
  isDone.value = false
  let i = 0
  const speed = 30 // millisecondes entre chaque caractère

  const timer = setInterval(() => {
    if (i < fullText.value.length) {
      displayedText.value += fullText.value.charAt(i)
      i++
    } else {
      clearInterval(timer)
      isDone.value = true
    }
  }, speed)
}

// Relancer l'effet quand la langue change
watch(locale, () => typeWriter())

// Lancement au montage
onMounted(() => {
  typeWriter()
})

</script>

<template>
  <UContainer class="py-10">
    <h1 class="text-3xl font-bold mb-8 uppercase tracking-tighter">
      {{ displayedText }}  
    </h1>
    <div v-if="articles?.length">
  <!-- Perspective container for 3D effects -->
  <div class="grid gap-px bg-zinc-900 border border-zinc-900 overflow-hidden perspective-container">
    <NuxtLink 
      v-for="(article, index) in articles" 
      :key="article.path"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :visible="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
      :to="getArticleRoute(article.path)"
      class="journal-card group relative flex items-start justify-between p-8 bg-[#050505] hover:bg-zinc-900/30 transition-all duration-500 ease-out"
    >
      <div class="flex gap-8 items-start">
        <!-- Index indicator -->
        <span class="font-mono text-[10px] text-zinc-800 mt-2">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        
        <div class="space-y-3 transition-transform duration-500 group-hover:translate-x-2">
          <!-- Title -->
          <h2 class="font-bold text-2xl text-zinc-100 group-hover:text-primary-500 transition-colors uppercase italic tracking-tight leading-none">
            {{ article.title }}
          </h2>
          
          <!-- Description -->
          <p class="max-w-2xl text-sm text-zinc-500 font-mono leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {{ article.description }}
          </p>
        </div>
      </div>

      <!-- Metadata / Date -->
      <div class="hidden lg:flex flex-col items-end gap-2 shrink-0">
        <div class="font-mono text-[10px] text-zinc-300 italic uppercase tracking-widest">
          // {{ article.date }}
        </div>
        <!-- Decorative element that appears on hover -->
        <div class="h-px w-0 bg-primary-500/50 group-hover:w-12 transition-all duration-500" />
      </div>
    </NuxtLink>
  </div>
</div>

<!-- Empty State -->
<div v-else class="text-pip-green-dim italic py-10 border border-dashed border-zinc-900 text-center uppercase text-xs tracking-[0.2em]">
  NO_DATA_FOUND_IN_COLLECTION
</div>

  </UContainer>
</template>