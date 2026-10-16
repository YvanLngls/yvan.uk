<script setup lang="ts">
const { t, tm, rt } = useI18n()

// Listes réactives
const education = computed(() => tm('about.education'))
const experiences = computed(() => tm('about.experiences'))
const skills = computed(() => tm('about.skills'))
const certifications = computed(() => tm('about.certifications'))

// Ta variante d'animation standard
const transitionUp = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }
}

useHead({ title: t('nav_about') })
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-24 py-12 relative">
    
    <!-- SECTION 01: HEADER / PITCH -->
    <section v-motion v-bind="transitionUp" class="space-y-6">
      <div class="flex items-center gap-3 font-mono text-[10px] text-primary-500 tracking-[0.3em] uppercase">
        <span class="h-px w-8 bg-primary-500"></span>
        {{ t('about.sections.profile') || 'PROFILE' }}
      </div>
      
      <h1 class="text-3xl md:text-4xl font-black italic tracking-tighter leading-[0.85] uppercase text-white">
        Yvan Langlois <span class="text-primary-500 block md:inline md:text-xl font-mono opacity-50 tracking-normal">// {{ t('about.title') }}</span>
      </h1>
      
      <div class="max-w-2xl border-l border-zinc-800 pl-6">
        <p class="text-lg text-zinc-400 leading-relaxed font-medium">
          {{ t('about.pitch') }}
        </p>
      </div>
    </section>
  
    <!-- SECTION 02: EXPÉRIENCES -->
    <section class="space-y-12">
      <div v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1 }" class="flex items-center gap-4">
        <h2 class="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap italic">
          // {{ t('about.sections.exp') }}
        </h2>
        <div class="h-px w-full bg-zinc-900"></div>
      </div>

      <div class="space-y-8">
        <div 
          v-for="(exp, index) in experiences" 
          :key="rt(exp.title)"
          v-motion
          :initial="{ opacity: 0, x: -10 }"
          :visible="{ opacity: 1, x: 0, transition: { delay: index * 100 } }"
          class="group relative p-8 border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-900/50 transition-all rounded-sm"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <h3 class="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-primary-500 transition-colors">
                {{ rt(exp.title) }}
              </h3>
              <div class="flex items-center gap-3 font-mono text-xs text-zinc-500">
                <span class="text-primary-500/70">{{ rt(exp.company) }}</span>
                <span class="text-zinc-800">|</span>
                <span>{{ rt(exp.date) }}</span>
              </div>
            </div>
            <UIcon :name="rt(exp.icon)" class="hidden md:block w-8 h-8 text-zinc-800 group-hover:text-primary-500/20 transition-colors" />
          </div>
          
          <p class="mt-6 text-zinc-400 text-sm leading-relaxed max-w-2xl italic">
            {{ rt(exp.description) }}
          </p>

          <ul v-if="exp.highlights" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <li v-for="point in exp.highlights" :key="rt(point)" class="text-[11px] font-mono text-zinc-500 flex items-start gap-2 uppercase tracking-tight">
              <span class="text-primary-500 mt-1">»</span>
              {{ rt(point) }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 03: SKILLS (GRID STYLE) -->
    <section class="space-y-12">
      <div v-motion-slide-visible-bottom class="flex items-center gap-4">
        <h2 class="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap italic">
          // {{ t('about.sections.skills') }}
        </h2>
        <div class="h-px w-full bg-zinc-900"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
        <div 
          v-for="(skillGroup, index) in skills" 
          :key="rt(skillGroup.label)"
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { delay: index * 100 } }"
          class="p-8 bg-[#050505] space-y-6"
        >
          <h3 class="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-500">{{ rt(skillGroup.label) }}</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="item in skillGroup.items" 
              :key="item" 
              class="px-2 py-1 border border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              {{ rt(item) }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 04: EDUCATION & CERTS (BENTO) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Formation -->
      <section class="md:col-span-2 space-y-8">
        <h2 class="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 italic">// {{ t('about.sections.edu') }}</h2>
        <div class="space-y-8 border-l border-zinc-900 ml-2">
          <div 
            v-for="edu in education" 
            :key="rt(edu.degree)"
            v-motion-slide-visible-bottom
            class="relative pl-8 group"
          >
            <div class="absolute -left-[5px] top-1.5 w-2 h-2 bg-zinc-900 border border-zinc-800 group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors"></div>
            <div class="text-[10px] font-mono text-primary-500/50 mb-1 tracking-widest uppercase">{{ rt(edu.date) }}</div>
            <h3 class="text-white font-bold uppercase italic tracking-tight">{{ rt(edu.degree) }}</h3>
            <p class="text-zinc-500 text-xs font-mono uppercase">{{ rt(edu.school) }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Certifications -->
    <section class="space-y-8">
      <h2 class="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 italic">// {{ t('about.sections.certs') }}</h2>
      <div class="grid gap-4">
        <div 
          v-for="cert in certifications" 
          :key="rt(cert.name)"
          v-motion-slide-visible-bottom
          class="p-4 border border-zinc-900 bg-zinc-950/50 group hover:border-primary-500/30 transition-colors"
        >
          <div class="flex items-center gap-3">
            <UIcon :name="rt(cert.icon)" class="w-5 h-5 text-zinc-700 group-hover:text-primary-500 transition-colors" />
            <div>
              <h4 class="text-[11px] font-bold text-zinc-300 leading-tight uppercase">{{ rt(cert.name) }}</h4>
              <p class="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">{{ rt(cert.issuer) }}</p>
              <p v-if="rt(cert.score)" class="text-[9px] font-mono text-primary-500 mt-1 opacity-50">{{ rt(cert.score) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>