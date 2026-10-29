<template>
  <section class="site-page site-author-index">
    <div>
      <CollectionIntro :title="copy.title" :description="copy.description" />

      <div v-if="pending" class="site-author-index-list" aria-label="Loading authors">
        <div v-for="i in 2" :key="i" class="site-author-index-skeleton" />
      </div>

      <p v-else-if="error" class="site-author-index-message">{{ $t('pages.authors.unavailable') }}</p>

      <div v-else class="site-author-index-list">
        <NuxtLink
          v-for="author in authors"
          :key="author.id"
          :to="localizedPath(`/authors/${author.slug || author.id}`, locale)"
          class="site-author-index-entry"
        >
          <NuxtImg
            v-if="author.avatar"
            provider="hubblob"
            :src="author.avatar"
            :alt="author.name"
            class="site-author-index-avatar"
            width="104"
            height="104"
          />
          <span v-else class="site-author-index-avatar site-author-index-avatar--empty" aria-hidden="true">
            {{ author.name.charAt(0).toUpperCase() }}
          </span>

          <span class="site-author-index-copy">
            <span class="site-author-index-name">{{ author.name }}</span>
            <span v-if="author.biography" class="site-author-index-biography">{{ author.biography }}</span>
            <span class="site-author-index-count">
              {{ author.postCount }}
              {{ locale === 'fr'
                ? (author.postCount === 1 ? 'article' : 'articles')
                : (author.postCount === 1 ? 'post' : 'posts') }}
            </span>
          </span>
        </NuxtLink>

        <p v-if="!authors.length" class="site-author-index-message">
          {{ locale === 'fr' ? 'Aucun auteur à afficher pour le moment.' : 'There are no authors to display yet.' }}
        </p>
      </div>
    </div>
  </section>

  <div class="site-public-archive-footer site-public-authors-footer">
    <NewsletterSubscription />
    <HomeRecommendations />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { localizedPath } from '~/utils/presentationPosts'

type Author = {
  id: number
  name: string
  slug?: string
  avatar: string | null
  biography: string | null
  job: string | null
  location: string | null
  postCount: number
}

const { $getLocale } = useI18n()
const locale = computed(() => $getLocale() === 'fr' ? 'fr' : 'en')
const copy = computed(() => locale.value === 'fr'
  ? {
      title: 'Contributeurs & collaborateurs',
      description: 'Un cercle choisi de rédacteurs, designers et chercheurs dont les perspectives nourrissent ce journal. Découvrez les personnes derrière les essais, les notes et les projets publiés ici.',
    }
  : {
      title: 'Contributors & Collaborators',
      description: 'A curated circle of writers, designers, and researchers whose perspectives shape this journal. Explore the people behind the essays, notes, and selected work published here.',
    })

const { data, pending, error } = await useFetch<Author[]>('/api/authors')
const authors = computed(() => data.value ?? [])
</script>
