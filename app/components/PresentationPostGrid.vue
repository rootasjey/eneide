<template>
  <section class="site-demo-post-grid" :aria-label="$t('pages.posts.publishedHeading')">
    <NuxtLink
      v-for="post in visiblePosts"
      :key="post.slug"
      :to="localizedPath(`/preview/${post.slug}`, locale)"
      class="site-demo-post"
    >
      <img :src="post.image" :alt="post.title[locale]" class="site-demo-post-image" loading="lazy" decoding="async">
      <span class="site-demo-post-copy">
        <span class="site-demo-post-title">{{ post.title[locale] }}</span>
        <span class="site-demo-post-meta">
          <span>{{ post.tag[locale] }}</span>
          <time>{{ formatDate(post.publishedAt) }}</time>
        </span>
      </span>
    </NuxtLink>
    <p v-if="filteredPosts.length === 0" class="site-demo-post-empty">
      {{ $t('pages.posts.noMatchingPresentationPosts') }}
    </p>
    <button
      v-if="visibleCount < filteredPosts.length"
      class="site-public-post-load-more"
      type="button"
      @click="visibleCount += pageSize"
    >
      {{ locale === 'fr' ? 'Charger plus' : 'Load More' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

const { $getLocale, $t } = useI18n()
const route = useRoute()
const locale = computed(() => $getLocale() === 'fr' ? 'fr' : 'en')
const pageSize = 4
const visibleCount = ref(pageSize)
const filteredPosts = computed(() => {
  const tag = String(route.query.tag || '').toLocaleLowerCase(locale.value)
  return PRESENTATION_POSTS
    .filter(post => !post.isProject)
    .filter(post => !tag || post.tag[locale.value].toLocaleLowerCase(locale.value) === tag)
})
const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value))

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(locale.value, { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>
