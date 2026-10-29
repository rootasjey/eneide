<template>
  <section class="home-recent-posts py-12 md:py-16 animate-entrance">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="site-recent-header flex items-center justify-between mb-6">
        <NuxtLink :to="localizedPath('/posts', $getLocale())" class="inline-block">
          <h2 class="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {{ $t('components.recentPosts.heading') }}
          </h2>
          <NIcon name="i-ph-arrow-right" aria-hidden="true" />
        </NuxtLink>

        <NuxtLink
          :to="localizedPath('/posts', $getLocale())"
          class="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-1"
          :aria-label="$t('common.viewAllPosts')"
        >
          <span>{{ $t('common.seeAll') }}</span>
          <NIcon name="i-ph-arrow-up-right" />
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 md:gap-y-12">
        <CardSkeleton v-for="i in 6" :key="i" :lines="3" />
      </div>

      <!-- Error -->
      <EmptyState
        v-else-if="error"
        :title="$t('components.recentPosts.unavailable')"
        :description="$t('components.recentPosts.unavailableDesc')"
        :secondary-to="localizedPath('/posts', $getLocale())"
        :secondary-label="$t('common.retry')"
        variant="card"
        icon="i-ph-clock-counter-clockwise-duotone"
      />

      <!-- Empty: dummy grid matching final UI -->
      <div v-else-if="!enhancedPosts.length" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 md:gap-y-12">
        <article v-for="(post, i) in demoPosts" :key="post.slug" class="group flex flex-col animate-entrance-item" :style="{ animationDelay: `${i * 40}ms` }">
          <NuxtLink :to="localizedPath(`/preview/${post.slug}`, $getLocale())" class="block flex flex-col h-full">
            <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 bg-gray-200 dark:bg-gray-800">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" decoding="async">
            </div>
            <div class="home-recent-content">
              <h3 class="line-clamp-2">{{ post.title }}</h3>
              <div class="home-recent-meta">
                <span class="home-recent-tag" :style="{ color: recentTagColor(post.tag) }">{{ post.tag }}</span>
                <time>{{ post.date }}</time>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Grid layout for posts -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 md:gap-y-12">
        <article
          v-for="(post, i) in enhancedPosts"
          :key="post.slug"
          class="group flex flex-col animate-entrance-item"
          :style="{ animationDelay: `${i * 40}ms` }"
        >
          <NuxtLink :to="localizedPath(`/posts/${post.slug}`, $getLocale())" class="block flex flex-col h-full">
            <!-- Image -->
            <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
              <PostImage :src="post.image?.src || '/images/corpinot-cover.jpeg'" :alt="post.image?.alt || post.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            <!-- Content -->
            <div class="home-recent-content">
              <h3 class="line-clamp-2 group-hover:opacity-80 transition-opacity">
                {{ post.name }}
              </h3>
              <div v-if="post.tags?.length || post.formattedDate" class="home-recent-meta">
                <span v-if="post.tags?.length" class="home-recent-tag" :style="{ color: recentTagColor(post.tags[0].name) }">{{ post.tags[0].name }}</span>
                <time v-if="post.formattedDate">{{ post.formattedDate }}</time>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Post } from '~~/shared/types/post'
import { EXCLUDED_TAGS } from '~/utils/tagConstants'
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

const { $t, $getLocale } = useI18n()
const { enhancePost } = usePost()

const { data: items, pending, error } = await useFetch<Post[]>('/api/posts', {
  query: { limit: 4, exclude: EXCLUDED_TAGS.join(',') },
})

const enhancedPosts = computed(() => {
  const posts = (items.value ?? []).map(p => enhancePost(p))
  const excludeSet = new Set(EXCLUDED_TAGS.map(t => t.toLowerCase()))
  return posts.filter(post => !(post.tags?.some(tag => excludeSet.has(tag.name.toLowerCase()))))
})

const demoPosts = computed(() => {
  const locale = $getLocale() === 'fr' ? 'fr' : 'en'
  return PRESENTATION_POSTS.filter(post => !post.isProject).slice(0, 4).map(post => ({
    slug: post.slug,
    title: post.title[locale],
    tag: post.tag[locale],
    image: post.image,
    date: new Date(post.publishedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
  }))
})

const RECENT_TAG_COLORS: Record<string, string> = {
  'minimalisme': '#a467d5',
  'minimalism': '#a467d5',
  'design': '#a467d5',
  'études de cas': '#36c86b',
  'case studies': '#36c86b',
  'créativité': '#efaa68',
  'creative': '#efaa68',
  'culture numérique': '#77b9ec',
  'digital culture': '#77b9ec',
}

function recentTagColor(tag: string) {
  return RECENT_TAG_COLORS[tag.toLocaleLowerCase()] ?? 'var(--corpinot-muted)'
}

</script>
