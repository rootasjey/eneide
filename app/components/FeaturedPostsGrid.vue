<template>
  <section class="home-featured-posts animate-entrance" :aria-label="$t('components.featuredPosts.heading')">
    <div ref="track" class="home-featured-track" @scroll.passive="updateActivePost">
      <article
        v-for="(post, index) in posts"
        :key="post.slug"
        class="home-featured-card"
        :class="{ 'is-active': index === activeIndex }"
      >
        <NuxtLink :to="post.to">
          <div class="home-featured-image">
            <img v-if="post.image.startsWith('/images/')" :src="post.image" :alt="post.title" loading="lazy" decoding="async">
            <PostImage v-else :src="post.image" :alt="post.title" loading="lazy" />
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.description }}</p>
          <span class="home-featured-meta">{{ post.date }}<template v-if="post.author"> — {{ post.author }}</template></span>
        </NuxtLink>
      </article>
    </div>

    <div class="home-featured-controls">
      <div v-if="posts.length > 1" role="group" class="home-featured-control-group" :aria-label="$t('components.featuredPosts.heading')">
        <button type="button" :aria-label="$t('common.previous')" @click="scroll('left')">
          <span class="i-ph-caret-left" aria-hidden="true" />
        </button>
        <button type="button" :aria-label="$t('common.next')" @click="scroll('right')">
          <span class="i-ph-caret-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Post } from '~~/shared/types/post'
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

const { $t, $getLocale } = useI18n()
const { enhancePost } = usePost()
const track = ref<HTMLElement>()
const activeIndex = ref(0)

const { data } = await useFetch<Post[]>('/api/posts', {
  query: { limit: 50, language: $getLocale(), exclude: ['top pinned', 'featured project', 'project'].join(',') },
})

const posts = computed(() => {
  const published = (data.value ?? []).map(post => enhancePost(post))
  if (published.length) {
    const featured = published.filter(post => post.tags?.some(tag => tag.name.toLocaleLowerCase() === 'featured post'))
    const remaining = published.filter(post => !featured.includes(post))

    return [...featured, ...remaining].slice(0, 3).map(post => ({
      slug: post.slug,
      to: localizedPath(`/posts/${post.slug}`, $getLocale()),
      title: post.name,
      description: post.description,
      image: post.image?.src || '/images/corpinot-cover.jpeg',
      date: post.formattedDate,
      author: post.user?.name,
    }))
  }

  const locale = $getLocale() === 'fr' ? 'fr' : 'en'
  return PRESENTATION_POSTS.filter(post => !post.isProject).slice(0, 3).map(post => ({
    slug: post.slug,
    to: localizedPath(`/preview/${post.slug}`, $getLocale()),
    title: post.title[locale],
    description: post.description[locale],
    image: post.image,
    date: new Date(post.publishedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    author: $t('nav.brand'),
  }))
})

function scroll(direction: 'left' | 'right') {
  const container = track.value
  const firstCard = container?.firstElementChild as HTMLElement | null
  if (!container || !firstCard) return

  const nextIndex = Math.max(0, Math.min(activeIndex.value + (direction === 'right' ? 1 : -1), container.children.length - 1))
  const targetCard = container.children[nextIndex] as HTMLElement | undefined
  if (!targetCard) return

  container.scrollTo({ left: targetCard.offsetLeft - firstCard.offsetLeft, behavior: 'smooth' })
}

function updateActivePost() {
  const container = track.value
  if (!container) return

  const center = container.getBoundingClientRect().left + container.clientWidth / 2
  let closestIndex = activeIndex.value
  let closestDistance = Number.POSITIVE_INFINITY

  Array.from(container.children).forEach((card, index) => {
    const rect = card.getBoundingClientRect()
    const distance = Math.abs(rect.left + rect.width / 2 - center)
    if (distance < closestDistance) {
      closestIndex = index
      closestDistance = distance
    }
  })

  activeIndex.value = closestIndex
}
</script>
