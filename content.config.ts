import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    journal: defineCollection({
      source: 'journal/**/*.md',
      type: 'page',
      // On définit un schéma pour avoir de l'auto-complétion et de la validation
      schema: z.object({
        title: z.string(),
        // ISO uniquement : le tri SQL sur la chaîne reste chronologique entre années
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD'),
        description: z.string()
      })
    })
  }
})
