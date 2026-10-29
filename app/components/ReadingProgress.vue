<template>
  <aside
    v-if="headings.length"
    class="site-reading-progress"
    :class="{ 'is-visible': isVisible, 'is-open': isOpen }"
    :style="{ '--reading-progress': `${progress}%` }"
    :aria-hidden="!isVisible && !isOpen"
    :inert="!isVisible && !isOpen"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @keydown.esc="isOpen = false"
  >
    <button
      class="site-reading-progress-head"
      type="button"
      :aria-expanded="isOpen || isHovered"
      :aria-label="$t('components.readingProgress.title')"
      @click="isOpen = !isOpen"
    >
      <span class="site-reading-progress-title">
        {{ $t('components.readingProgress.title') }}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </span>
      <span class="site-reading-progress-time">{{ readingMinutes }} min</span>
      <svg class="site-reading-progress-ring" viewBox="0 0 16 16" aria-hidden="true">
        <circle class="site-reading-progress-ring-track" cx="8" cy="8" r="7" />
        <circle
          class="site-reading-progress-ring-value"
          cx="8"
          cy="8"
          r="7"
          :style="{ strokeDashoffset: `${ringCircumference * (1 - progress / 100)}` }"
        />
      </svg>
    </button>

    <nav class="site-reading-progress-menu" :aria-label="$t('components.readingProgress.contents')">
      <a
        v-for="(heading, index) in headings"
        :key="heading.id"
        :href="`#${heading.id}`"
        :class="{ active: index === activeHeadingIndex }"
        :style="{ '--heading-level': heading.level }"
        @click="isOpen = false"
      >
        {{ heading.title }}
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'

interface Props {
  contentSelector: string
}

interface HeadingItem {
  id: string
  title: string
  level: number
}

const props = defineProps<Props>()
const { $t } = useI18n()
const headings = ref<HeadingItem[]>([])
const readingMinutes = ref(1)
const progress = ref(0)
const activeHeadingIndex = ref(0)
const isOpen = ref(false)
const isHovered = ref(false)
const isVisible = computed(() => progress.value > 0 && progress.value < 100)

const ringCircumference = 2 * Math.PI * 7
let contentElement: HTMLElement | null = null
let contentObserver: MutationObserver | null = null
let frameId = 0

function headingId(heading: HTMLElement, index: number) {
  if (heading.id) return heading.id

  const slug = heading.textContent?.trim().toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50) || 'section'
  const baseId = `reading-${index + 1}-${slug}`
  let id = baseId
  let suffix = 2

  while (document.getElementById(id)) {
    id = `${baseId}-${suffix++}`
  }

  heading.id = id
  return id
}

function updateHeadings() {
  if (!contentElement) return

  const text = contentElement.textContent?.trim() ?? ''
  const wordCount = text ? text.split(/\s+/).length : 0
  readingMinutes.value = Math.max(1, Math.ceil(wordCount / 200))
  headings.value = [...contentElement.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')]
    .filter(heading => heading.textContent?.trim())
    .map((heading, index) => ({
      id: headingId(heading, index),
      title: heading.textContent?.trim() ?? '',
      level: Number(heading.tagName.slice(1)),
    }))
}

function updateProgress() {
  if (!contentElement) return

  const rect = contentElement.getBoundingClientRect()
  const nextProgress = rect.height > 0
    ? Math.min(100, Math.max(0, ((50 - rect.top) / rect.height) * 100))
    : 0

  progress.value = Math.round(nextProgress * 100) / 100

  const currentHeading = headings.value.reduce((activeIndex, heading, index) => {
    const element = document.getElementById(heading.id)
    return element && element.getBoundingClientRect().top <= 60 ? index : activeIndex
  }, 0)
  activeHeadingIndex.value = currentHeading
}

function scheduleProgressUpdate() {
  if (frameId) return

  frameId = requestAnimationFrame(() => {
    frameId = 0
    updateProgress()
  })
}

async function attachContent() {
  await nextTick()
  const nextContent = document.querySelector<HTMLElement>(props.contentSelector)

  if (nextContent === contentElement) {
    return
  }

  contentObserver?.disconnect()
  contentElement = nextContent

  if (!contentElement) {
    headings.value = []
    progress.value = 0
    return
  }

  contentObserver = new MutationObserver(() => {
    updateHeadings()
    scheduleProgressUpdate()
  })
  contentObserver.observe(contentElement, { childList: true, subtree: true, characterData: true })
  updateHeadings()
  scheduleProgressUpdate()
}

onMounted(() => {
  window.addEventListener('scroll', scheduleProgressUpdate, { passive: true })
  window.addEventListener('resize', scheduleProgressUpdate, { passive: true })
  void attachContent()
})

onUpdated(() => {
  void attachContent()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleProgressUpdate)
  window.removeEventListener('resize', scheduleProgressUpdate)
  contentObserver?.disconnect()
  if (frameId) cancelAnimationFrame(frameId)
})
</script>
