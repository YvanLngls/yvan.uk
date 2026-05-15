// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@vueuse/motion/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  devServer: {
    port: 3100
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    strategy: 'no_prefix',  // ← Corrigé : tu voulais /fr et /en dans les URLs
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales',  // ← Sans slash final, plus fiable
    detectBrowserLanguage: false
    // vueI18n: './i18n.config.ts'  // ← String, pas un objet !
  },
  motion: {
    directives: {
      'pop-in': {
        initial: { scale: 0, opacity: 0 },
        enter: { scale: 1, opacity: 1 }
      }
    }
  }

})
