<template>
  <main class="site-page site-recommendations-page">
    <div class="site-recommendations-content">
      <CollectionIntro :title="copy.title" :description="copy.description" />
      <HomeRecommendations :show-heading="false" />
    </div>
  </main>

  <div class="site-recommendations-newsletter">
    <NewsletterSubscription />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { $getLocale } = useI18n()
const copy = computed(() => $getLocale() === 'fr'
  ? {
      title: 'Recommandations',
      description: 'Une sélection personnelle de studios, de publications, d’outils et de personnes à qui je reviens souvent. Ces références nourrissent ma pratique et ouvrent de nouvelles perspectives.',
    }
  : {
      title: 'Recommendations',
      description: 'A personal selection of studios, publications, tools, and thinkers I return to often. These are the references that continue to inform my practice and point my attention forward.',
    })

useSeoMeta({
  title: () => `${copy.value.title} - Corpinot`,
  description: () => copy.value.description,
})
</script>
