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

<style>
@layer components {

/* Component and page styles moved from the global stylesheets. */
.site-shell .site-recommendations-page { padding: 70px 0 0; }
.site-shell .site-recommendations-content { width: min(700px, calc(100vw - 32px)); margin-inline: auto; }
.site-shell .site-recommendations-page .site-collection-intro { margin: 0 0 104px; }
.site-shell .site-recommendations-page .site-collection-avatar { margin-bottom: 48px; }
.site-shell .site-recommendations-page .site-home-recommendations-inner { width: 100%; max-width: 100%; }
.site-shell .site-recommendations-page .site-home-recommendations-grid { width: 100%; max-width: 100%; margin-left: 0; }
.site-shell .site-recommendations-page .site-home-recommendations { margin-top: 0; padding-bottom: 0; }
.site-shell .site-recommendations-newsletter .home-newsletter { margin-top: 150px; }
@media (max-width: 1023px) {
  .site-shell .site-recommendations-page { padding-top: 40px; }
}
@media (max-width: 1023px) {
  .site-shell .site-recommendations-page .site-collection-intro { margin-bottom: 64px; }
}
@media (max-width: 1023px) {
  .site-shell .site-recommendations-page .site-collection-avatar { margin-bottom: 32px; }
}
@media (max-width: 1023px) {
  .site-shell .site-recommendations-newsletter .home-newsletter { margin-top: 100px; }
}
}
</style>
