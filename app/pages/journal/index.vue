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
    
    <div v-if="articles?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink 
        v-for="article in articles" 
        :key="article.path"
        :to="getArticleRoute(article.path)"
        class="block opacity-50 hover:opacity-100 transition-opacity"
      >
        <UCard class="h-full">
          <template #header>
            <div class="space-y-2">
              <h2 class="font-bold text-pip-amber text-xl">{{ article.title }}</h2>
              <h2 class="italic text-sm">{{ article.date }}</h2>
            </div>
          </template>
          
          <p class="text-gray-400 font-mono text-sm mb-4">
            {{ article.description }}
          </p>
        </UCard>
      </NuxtLink>
    </div>
    <div v-else class="text-pip-green-dim italic">
      NO_DATA_FOUND_IN_COLLECTION
    </div>
  </UContainer>
</template>