import type { PageCollectionItemBase, DataCollectionItemBase } from '@nuxt/content'

declare module '@nuxt/content' {
   interface JournalCollectionItem extends PageCollectionItemBase {
    title: string
    date: string
    description: string
  }
  

  interface PageCollections {
    journal: JournalCollectionItem
  }

  interface Collections {
    journal: JournalCollectionItem
  }
}
