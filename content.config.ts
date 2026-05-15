import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    journal: defineCollection({
      source: 'journal/**/*.md',
      type: 'page',
      // On définit un schéma pour avoir de l'auto-complétion et de la validation
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string()
      })
    })
  }
})