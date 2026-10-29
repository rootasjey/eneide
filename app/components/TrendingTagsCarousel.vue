<template>
  <section class="home-trending-tags">
    <div class="container mx-auto">
      <h2>
        <NuxtLink class="home-trending-tags-heading" :to="localizedPath('/tags', $getLocale())">
          <span>{{ $t('components.trendingTags.heading') }}</span>
          <span class="i-ph-arrow-right" aria-hidden="true" />
        </NuxtLink>
      </h2>
      <nav :aria-label="$t('components.trendingTags.heading')">
        <NuxtLink
          v-for="(tag, index) in tags"
          :key="tag.name"
          :to="`${localizedPath('/posts', $getLocale())}?tag=${encodeURIComponent(tag.name)}`"
          :aria-label="`${tag.name}: ${tag.count}`"
        >
          <span class="home-trending-tag-icon" aria-hidden="true">
            <span :class="tagIcons[index % tagIcons.length]" />
          </span>
          <span class="home-trending-tag-name">
            {{ tag.name }}
            <span class="home-trending-tag-count">x{{ tag.count }}</span>
          </span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApiTag } from '~~/shared/types/tags'
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

const { $getLocale, $t } = useI18n()
const tagStore = useTagStore()
const tagIcons = ['i-ph-triangle-fill', 'i-ph-heart-fill', 'i-ph-crown-fill', 'i-ph-bookmark-simple-fill']

try {
  await tagStore.fetchTags()
} catch {
  // Presentation tags keep the homepage navigable when the API is unavailable.
}

const tags = computed(() => {
  const locale = $getLocale() === 'fr' ? 'fr' : 'en'
  const posts = PRESENTATION_POSTS.filter(post => !post.isProject)
  const sampleCounts = new Map<string, number>()

  for (const post of posts) {
    const name = post.tag[locale]
    sampleCounts.set(name, (sampleCounts.get(name) || 0) + 1)
  }

  const liveTags = (tagStore.allTags as (ApiTag & { count?: number })[]).slice(0, 4)
  if (liveTags.length) {
    return liveTags.map(tag => ({
      name: tag.name,
      count: tag.count ?? sampleCounts.get(tag.name) ?? 1,
    }))
  }

  return [...sampleCounts].slice(0, 4).map(([name, count]) => ({ name, count }))
})
</script>
