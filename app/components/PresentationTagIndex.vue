<template>
  <section class="site-page site-demo-tag-index">
    <div class="site-demo-tag-content">
      <CollectionIntro :title="copy.title" :description="copy.description" />
      <nav :aria-label="copy.title">
        <NuxtLink
          v-for="item in tags"
          :key="item.name"
          :to="`${localizedPath('/posts', locale)}?tag=${encodeURIComponent(item.name)}`"
          :aria-label="`${item.name} x${item.count}`"
          :style="{ '--tag-accent': item.color }"
        >
          <span class="site-demo-tag-icon" aria-hidden="true">
            <svg v-if="item.icon === 'triangle'" viewBox="0 0 24 24"><path d="M10.71 5.49a1.5 1.5 0 0 1 2.58 0l8.09 14a1.5 1.5 0 0 1-1.29 2.25H3.91a1.5 1.5 0 0 1-1.29-2.25z" /></svg>
            <svg v-else-if="item.icon === 'heart'" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78" /></svg>
            <svg v-else-if="item.icon === 'crown'" viewBox="0 0 24 24"><path d="m2.5 7.1 5.2 4.1 4.3-7 4.3 7 5.2-4.1-2.2 12.4H4.7z" /></svg>
            <svg v-else-if="item.icon === 'bookmark'" viewBox="0 0 24 24"><path d="M6 3.75h12a1 1 0 0 1 1 1v16l-7-4.4-7 4.4v-16a1 1 0 0 1 1-1" /></svg>
            <span v-else>{{ item.name.slice(0, 1).toUpperCase() }}</span>
          </span>
          <span class="site-demo-tag-name">
            {{ item.name }}
            <span class="site-demo-tag-count">x{{ item.count }}</span>
          </span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { localizedPath, PRESENTATION_POSTS } from '~/utils/presentationPosts'

type TagItem = { name: string; count: number }

const props = defineProps<{ tags?: TagItem[] }>()

const { $getLocale } = useI18n()
const locale = computed(() => $getLocale() === 'fr' ? 'fr' : 'en')
const tagAccents = [
  '#a467d5',
  '#ef716e',
  '#f79c5f',
  '#56b3fb',
  '#36c96e',
  '#e0529e',
  '#85858d',
  '#b8b8c0',
]
const tagIcons = ['triangle', 'heart', 'crown', 'bookmark'] as const
const copy = computed(() => locale.value === 'fr'
  ? {
      title: 'Thèmes & sujets',
      description: 'Un index des thèmes qui reviennent dans le journal, des systèmes d’interface et du langage visuel à la direction créative, aux processus et à l’avenir des expériences numériques.',
    }
  : {
      title: 'Topics & Threads',
      description: 'An index of recurring themes across the journal, from interface systems and visual language to creative direction, process, and the future of digital experiences.',
    })
const tags = computed(() => {
  if (props.tags) {
    return props.tags.map((item, index) => ({
      ...item,
      color: tagAccents[index % tagAccents.length],
      icon: tagIcons[index],
    }))
  }

  const posts = PRESENTATION_POSTS.filter(post => !post.isProject)
  return [...new Set(posts.map(post => post.tag[locale.value]))].map((name, index) => ({
    name,
    count: posts.filter(post => post.tag[locale.value] === name).length,
    color: tagAccents[index % tagAccents.length],
    icon: tagIcons[index],
  }))
})
</script>
