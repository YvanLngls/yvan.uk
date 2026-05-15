<script setup lang="ts">
const { locale, t } = useI18n()

// Logique du Typewriter
const fullText = computed(() => t('hero.description_typed'))
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
watch(locale, async () => {
  typeWriter();
  await refresh(); // Manually force the data to update when locale changes
})

// Lancement au montage
onMounted(() => {
  typeWriter()
})


// Récupération des articles de blog (filtrés par langue)
const { data: articles, refresh } = await useAsyncData(
  () => `posts-${locale.value}`,
  () => queryCollection('journal')
    .where('path', 'LIKE', `/journal/${locale.value}/%`)
    .limit(4)
    .all(),
  { watch: [locale] }
)
// 2. Récupération du nombre TOTAL d'articles (pour le compteur)
const { data: totalArticles } = await useAsyncData(`total-posts-${locale.value}`, () => {
  return queryCollection('journal')
    .where('path', 'LIKE', `/journal/${locale.value}/%`)
    .count() // Récupère uniquement le chiffre global
}, { watch: [locale] })

// Variantes d'animation Rauno
const transitionUp = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut' } }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-32 py-20 relative">
    
    <!-- SECTION 01: HERO -->
    <section v-motion v-bind="transitionUp" class="space-y-8">
      <div class="flex items-center gap-3 font-mono text-[10px] text-primary-500 tracking-[0.3em] uppercase">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
        </span>
        {{ t('hero.status') }}
      </div>

      <h1 class="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase">
        {{ t('hero.title_1') }}
        <span class="text-primary-500"> {{ t('hero.title_2') }} </span>
      </h1>

      <div class="max-w-lg min-h-[80px] border-l border-zinc-800 pl-6 space-y-2">
        <p class="font-mono text-sm leading-relaxed text-zinc-400">
          <span class="text-primary-500 font-bold">{{ t('hero.intro_prefix') }}</span>
          {{ displayedText }}
          <span 
            class="inline-block w-2 h-4 bg-primary-500 ml-1 translate-y-0.5"
            :class="{ 'animate-pulse': isDone, 'opacity-100': !isDone }"
          ></span>
        </p>
      </div>

      <div class="flex flex-wrap gap-4 pt-4">
        <UButton to="/journal" color="primary" variant="solid" size="lg" class="font-bold italic uppercase tracking-wider rounded-none">
          {{ t('hero.cta_projects') }}
        </UButton>
        <UButton to="/about" color="neutral" variant="ghost" size="lg" class="rounded-none border border-zinc-800 hover:bg-zinc-900">
          {{ t('hero.cta_profile') }}
        </UButton>
      </div>
    </section>

    <!-- SECTION 02: BLOG LOGS -->
    <section class="space-y-12">
      <div v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1 }" class="flex items-center justify-between border-b border-zinc-900 pb-4">
        <h2 class="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
          {{ t('logs.title') }} <span class="text-primary-500/50">[{{ totalArticles || 0 }}]</span>
        </h2>
        <UButton to="/journal" variant="link" color="neutral" class="text-[10px] uppercase tracking-widest font-mono group">
          {{ t('logs.cta_blog') }}
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right-20-solid" class="group-hover:translate-x-1 transition-transform" />
          </template>
        </UButton>
      </div>

      <div class="grid gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
        <NuxtLink 
          v-for="(post, index) in articles" 
          :key="post.path"
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { delay: index * 50 } }"
          :to="`/journal/${post.path.split('/').pop()}`"
          class="group flex items-center justify-between p-6 bg-[#050505] hover:bg-zinc-900/40 transition-colors"
        >
          <div class="flex items-center gap-8">
            <span class="font-mono text-[10px] text-zinc-800">0{{ index + 1 }}</span>
            <span class="font-bold text-xl group-hover:text-primary-500 transition-colors uppercase italic tracking-tight">
              {{ post.title }}
            </span>
          </div>
          <div class="hidden md:block font-mono text-[10px] text-zinc-700 italic uppercase">
            // {{ post.date }}
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- SECTION 03: BENTO LAB -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-motion-slide-visible-bottom class="md:col-span-3 p-10 bg-zinc-900/20 border border-zinc-900 flex flex-col justify-between group">
        <div class="font-mono text-[10px] text-primary-500 uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">
          {{ t('bento.stack_label') }}
        </div>
        <div class="flex flex-wrap gap-2 mt-12">
          <UBadge v-for="t in ['Powershell', 'Python', 'Git', 'VMware', 'vCenter', 'HyperV', 'Palo Alto', 'Docker', 'YAML', 'Redfish API', 'TCP/IP', 'DNS', 'DHCP', 'VLAN', 'Veeam', 'Centreon', 'Datacore', 'Windows', 'Linux']" :key="t" 
            variant="outline" class="font-mono text-[10px] rounded-none border-zinc-800 text-zinc-500">
            {{ t }}
          </UBadge>
        </div>
      </div>

      <NuxtLink 
        to="/about"
        v-motion-slide-visible-bottom
        class="md:col-span-1 p-10 bg-primary-500 group relative overflow-hidden flex flex-col items-center justify-center text-center hover:bg-white transition-colors duration-300"
      >
        <span class="text-black font-black text-4xl uppercase leading-[0.8] z-10 tracking-tighter">
          {{ t('bento.cv_title') }} <br/> <span class="italic text-6xl">{{ t('bento.cv_subtitle') }}</span>
        </span>
        <UIcon name="i-heroicons-arrow-up-right-20-solid" class="text-black w-6 h-6 mt-4 z-10" />
      </NuxtLink>
    </section>

  </div>
</template>