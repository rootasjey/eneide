<template>
  <section class="site-home-recommendations">
    <div class="site-home-recommendations-inner">
      <h2 v-if="showHeading">{{ heading }}</h2>
      <div class="site-home-recommendations-grid">
        <a
          v-for="item in recommendations"
          :key="item.name"
          class="site-home-recommendation"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="item.icon" alt="" width="22" height="22" loading="lazy" decoding="async">
          <span class="site-home-recommendation-title">
            <span>{{ item.name }}</span>
            <span class="i-ph-arrow-up-right" aria-hidden="true" />
          </span>
          <span class="site-home-recommendation-description">{{ item.description }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { $getLocale, $t } = useI18n()
withDefaults(defineProps<{ showHeading?: boolean }>(), { showHeading: true })
const heading = computed(() => {
  const translated = $t('components.homeRecommendations.heading')
  if (translated.toLocaleLowerCase() !== 'components.homerecommendations.heading') return translated
  return $getLocale() === 'fr' ? 'Recommandations' : 'Recommendations'
})
const recommendations = computed(() => {
  const french = $getLocale() !== 'en'
  return [
    {
      name: 'GitHub',
      description: french ? 'Dépôt de code' : 'Code Repository',
      href: 'https://github.com/',
      icon: 'https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg',
    },
    {
      name: 'Prime Direction',
      description: french ? 'Thèmes Ghost premium' : 'Premium Ghost Themes',
      href: 'https://primedirection.org/',
      icon: 'https://primedirection.org/favicon.png',
    },
    {
      name: 'Figma',
      description: french ? 'Outil de conception' : 'Design Tool',
      href: 'https://figma.com/',
      icon: 'https://static.figma.com/app/icon/2/touch-180.png',
    },
  ]
})
</script>
