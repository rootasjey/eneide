<template>
  <div class="site-home bg-gray-50 dark:bg-gray-950">
    <!-- Client-only mobile experience -->
    <ClientOnly>
      <component
        v-if="mobileIndex && isMobile"
        :is="mobileIndex"
      />
    </ClientOnly>

    <!-- Desktop / SSR experience -->
    <div v-if="!isMobile">
      <section class="site-intro">
        <img class="site-intro-mark" src="/images/presentation/jc-pp.jpg" alt="Jérémie Corpinot" width="100" height="100">
        <h1>Jérémie Corpinot</h1>
        <p v-for="(paragraph, index) in homeIntroParagraphs" :key="index">{{ paragraph }}</p>
        <a class="site-interactive-hover site-intro-subscribe" href="#newsletter">{{ $t('common.subscribe') }}</a>
      </section>
      <div class="animate-entrance"><FeaturedPostsGrid /></div>
      <div class="animate-entrance"><TrendingTagsCarousel /></div>
      <div class="animate-entrance"><RecentPostsGrid /></div>
      <div class="animate-entrance"><NewsletterSubscription /></div>
      <div class="animate-entrance"><ProjectsCarousel /></div>
      <div class="animate-entrance"><HomeRecommendations /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const isMobile = useIsMobile()
const config = useRuntimeConfig()

const mobileIndex = computed(() => {
  if (!import.meta.client) return null
  return defineAsyncComponent(() => import('~~/app/components/MobileIndex.vue'))
})

const ogImageUrl = `${config.public.siteUrl}/og/home/default.png`

const { $t } = useI18n()
const homeIntroParagraphs = computed(() => $t('pages.home.intro').split(/\n\s*\n/).filter(Boolean))

const { website } = useJsonld()

useSeoMeta({
  title: $t('pages.home.title'),
  description: $t('pages.home.description'),
  ogTitle: $t('pages.home.ogTitle'),
  ogDescription: $t('pages.home.ogDescription'),
  ogImage: ogImageUrl,
  ogUrl: config.public.siteUrl,
  twitterCard: 'summary_large_image',
  twitterImage: ogImageUrl,
})

useHead({
  link: [{ rel: 'canonical', href: config.public.siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(website()),
    },
  ],
})
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
