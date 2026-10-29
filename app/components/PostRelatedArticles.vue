<template>
  <section v-if="articles.length" class="site-post-related" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ $t('components.relatedPosts.heading') }}</h2>
    <div class="site-post-related-grid">
      <NuxtLink v-for="article in articles" :key="article.to" class="site-post-related-card" :to="article.to">
        <img :src="article.image" :alt="article.title" loading="lazy" decoding="async">
        <span class="site-post-related-copy">
          <span class="site-post-related-title">{{ article.title }}</span>
          <span class="site-post-related-meta">
            <span>{{ article.tag }}</span>
            <time v-if="article.date" :datetime="article.date">{{ article.dateLabel }}</time>
          </span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  articles: Array<{
    to: string
    title: string
    image: string
    tag: string
    date?: string
    dateLabel?: string
  }>
}>()

const { $t } = useI18n()
const headingId = useId()
</script>
