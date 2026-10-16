<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()
const slug = route.params.slug

const { data: post } = await useAsyncData(`post-${slug}-${locale.value}`, () => {
  return queryCollection('journal')
    .path(`/journal/${locale.value}/${slug}`)
    .first()
}, {
  watch: [locale]
})
</script>

<template>
  <UContainer>
    <article v-if="post">
      <header class="py-8">
        <h1 class="text-4xl font-bold">{{ post.title }}</h1>
        <p class="text-gray-500">{{ post.date }}</p>
      </header>
      
      <ContentRenderer :value="post" />
    </article>
    
    <div v-else class="py-20 text-center">
      <p>L'article "{{ slug }}" n'existe pas en {{ locale }}.</p>
      <UButton to="/journal" variant="ghost">Retour au journal</UButton>
    </div>
  </UContainer>
</template>