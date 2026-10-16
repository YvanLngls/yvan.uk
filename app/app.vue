<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

const toggleLang = async () => {
  const target = locale.value === 'fr' ? 'en' : 'fr'
  await setLocale(target)
}

const title = 'yvan.uk'
const description = "Explorations techniques, laboratoire et notes d'un passionné de technologie."

useHead({
  titleTemplate: (chunk) => chunk ? `${chunk}` : title,
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: locale.value }
})

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogSiteName: 'yvan.uk',
  themeColor: '#1aff80'
})

const { isPlaying, toggle } = useJukebox()

</script>

<template>
  <UApp>
    <!-- L'ÉCRAN CRT (L'effet visuel global) -->
    <div class="crt-monitor">
      
      <!-- Conteneur principal du site -->
      <div class="min-h-screen flex flex-col bg-[#050505] text-zinc-300 font-sans selection:bg-primary-500 selection:text-black">
        
        <!-- HEADER -->
        <header class="sticky top-0 z-40 border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-md p-4">
          <div class="max-w-5xl mx-auto flex justify-between items-center">
            <div class="flex space-x-2">
              <NuxtLink to="/" class="group flex items-center gap-2">
                <span class="text-xl font-black tracking-tighter text-white group-hover:text-primary-500 transition-colors uppercase italic">
                  yvan.uk
                </span>
                <span class="px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-500 text-[10px] font-mono font-bold tracking-widest uppercase">
                  Lab
                </span>
              </NuxtLink>
              <button @click="toggle" class="flex items-center gap-2 font-mono text-[10px] border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-800 transition-all group" :class="{ 'border-primary-500/50 bg-primary-500/5': isPlaying }">
                <div class="relative flex items-center justify-center w-3 h-3">
                  <span v-if="isPlaying" class="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25"></span>
                  <UIcon 
                    :name="isPlaying ? 'i-heroicons-signal-20-solid' : 'i-heroicons-pause-circle'" 
                    :class="isPlaying ? 'text-primary-500' : 'text-zinc-600 group-hover:text-primary-500'"
                    class="w-4 h-4"
                  />
                </div>
                <span class="text-zinc-600 group-hover:text-primary-500 uppercase">
                  {{ isPlaying ? t('jukebox.play') : t('jukebox.stop') }}
                </span>
              </button>
            </div>
            
            <nav class="flex items-center gap-6">
              <div class="hidden md:flex items-center gap-6 text-sm font-mono tracking-tight uppercase">
                <NuxtLink to="/about" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">{{ t('nav_about') }}</NuxtLink>
                <NuxtLink to="/discovery" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">{{ t('nav_discovery') }}</NuxtLink>
                <NuxtLink to="/journal" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">{{ t('nav_blog') }}</NuxtLink>
              </div>
              <button @click="toggleLang" class="group font-mono text-[10px] border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-800 transition-all">
                <span class="text-zinc-600 group-hover:text-primary-500 uppercase">{{ locale }}</span>
              </button>
            </nav>
          </div>
        </header>

        <!-- MAIN -->
        <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
          <NuxtPage />
        </main>

        <!-- FOOTER -->
        <footer class="border-t border-zinc-900 p-8">
          <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <span>© {{ new Date().getFullYear() }} // yvan.uk</span>
            <div class="flex items-center gap-6">
              <a href="https://github.com/YvanLngls" target="_blank" class="hover:text-primary-500 transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/yvan-langlois/" target="_blank" class="hover:text-primary-500 transition-colors">LinkedIn</a>
              <div class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                STATUS: Online
              </div>
            </div>
          </div>
        </footer>
      </div>

      <!-- LES COUCHES DE L'EFFET (Placées à la fin pour être au-dessus) -->
      <div class="crt-overlay"></div>
      <div class="crt-scanline"></div>
    </div>
  </UApp>
</template>

<style>
/* Reset & Base */
:root {
  --primary: 26 255 128;
}

/* Le conteneur "Moniteur" qui englobe tout */
.crt-monitor {
  position: relative;
  overflow: hidden;
}

/* 1. Les Scanlines fixes (Lignes horizontales) */
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.2) 50%
  );
  background-size: 100% 4px; /* Hauteur des lignes */
  z-index: 100;
  pointer-events: none;
}

/* 2. La barre de balayage qui descend (Scanline animée) */
.crt-scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    rgba(26, 255, 128, 0) 0%,
    rgba(26, 255, 128, 0.05) 10%,
    rgba(26, 255, 128, 0) 20%
  );
  animation: scanline-move 8s linear infinite;
}

/* 3. L'effet de tube (Vignettage et distorsion lumineuse) */
.crt-monitor::after {
  content: " ";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: radial-gradient(
    circle, 
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 102;
  pointer-events: none;
}

/* Animations */
@keyframes scanline-move {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* Transitions de page */
.page-enter-active, .page-leave-active { transition: all 0.3s ease; }
.page-enter-from, .page-leave-to { opacity: 0; filter: blur(4px); }
</style>