<template>
  <section class="home-projects animate-entrance">
    <div class="container mx-auto">
      <div class="home-project-heading">
        <NuxtLink :to="localizedPath('/projects', $getLocale())">
          <h2>{{ $t('components.projectsCarousel.heading') }}</h2>
          <span class="i-ph-arrow-right" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div v-if="pending" class="site-home-project-grid" aria-hidden="true">
        <div v-for="i in 2" :key="i" class="site-home-project-skeleton" />
      </div>

      <EmptyState
        v-else-if="error"
        :title="$t('components.projectsCarousel.unavailable')"
        :description="$t('components.projectsCarousel.unavailableDesc')"
        variant="card"
        icon="i-ph-folder-duotone"
      />

      <div v-else class="site-home-project-grid">
        <article v-for="project in projects" :key="project.slug" class="site-home-project-card">
          <NuxtLink :to="project.to">
            <div class="site-home-project-image">
              <img v-if="project.image.startsWith('/images/')" :src="project.image" :alt="project.title" loading="lazy" decoding="async">
              <PostImage v-else :src="project.image" :alt="project.title" loading="lazy" />
            </div>
            <h3>{{ project.title }}</h3>
            <div class="site-home-project-meta">
              <span>{{ project.tag }}</span>
              <span>{{ project.year }}</span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '~~/shared/types/post'
const { $t, $getLocale } = useI18n()
import {
  FEATURED_PROJECT_FALLBACK_IMAGE,
  FEATURED_PROJECT_TAG,
  FEATURED_PROJECTS_KEY,
} from '~/utils/featuredProjects'
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

const { enhancePost } = usePost()

// Fetch posts with the featured project tag
const { data, pending, error } = await useFetch<Post[]>('/api/posts', {
  query: { tag: FEATURED_PROJECT_TAG, limit: 12, language: $getLocale() },
  key: FEATURED_PROJECTS_KEY,
})

const projects = computed(() => {
  if (data.value && data.value.length > 0) {
    return data.value.map(p => enhancePost(p)).map(post => ({
      slug: post.slug,
      to: localizedPath(`/posts/${post.slug}`, $getLocale()),
      title: post.name,
      image: post.image?.src || FEATURED_PROJECT_FALLBACK_IMAGE,
      tag: post.tags?.[0]?.name || $t('components.projectsCarousel.project'),
      year: post.formattedDate.match(/\d{4}/)?.[0] || '',
    }))
  }
  
  // Presentation projects keep the portfolio navigable before CMS content exists.
  const locale = $getLocale() === 'fr' ? 'fr' : 'en'
  return PRESENTATION_POSTS.filter(project => project.isProject).map(project => ({
    slug: project.slug,
    to: localizedPath(`/preview/${project.slug}`, $getLocale()),
    title: project.title[locale],
    image: project.image,
    tag: project.tag[locale],
    year: new Date(project.publishedAt).getFullYear().toString(),
  }))
})
</script>
