<template>
  <div class="site-post-share-actions" role="group" :aria-label="$t('components.postShare.label')">
    <button type="button" :aria-label="$t('components.postShare.copy')" :title="$t('components.postShare.copy')" @click="copyLink">
      <span class="i-ph-copy" aria-hidden="true" />
    </button>
    <a
      :href="facebookShareUrl"
      :aria-label="$t('components.postShare.facebook')"
      :title="$t('components.postShare.facebook')"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="i-ph-facebook-logo" aria-hidden="true" />
    </a>
    <a
      :href="xShareUrl"
      :aria-label="$t('components.postShare.x')"
      :title="$t('components.postShare.x')"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="i-ph-x-logo" aria-hidden="true" />
    </a>
    <a :href="linkedinShareUrl" :aria-label="$t('components.postShare.linkedin')" :title="$t('components.postShare.linkedin')" target="_blank" rel="noopener noreferrer">
      <span class="i-ph-linkedin-logo" aria-hidden="true" />
    </a>
    <a :href="blueskyShareUrl" :aria-label="$t('components.postShare.bluesky')" :title="$t('components.postShare.bluesky')" target="_blank" rel="noopener noreferrer">
      <span class="i-ph-butterfly" aria-hidden="true" />
    </a>
    <a :href="pinterestShareUrl" :aria-label="$t('components.postShare.pinterest')" :title="$t('components.postShare.pinterest')" target="_blank" rel="noopener noreferrer">
      <span class="i-ph-pinterest-logo" aria-hidden="true" />
    </a>
    <span v-if="copied || copyFailed" class="site-post-share-status" role="status">
      {{ $t(copied ? 'components.postShare.copied' : 'components.postShare.copyFailed') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{ title: string }>()
const { $t } = useI18n()
const pageUrl = ref('')
const pageImage = ref('')
const copied = ref(false)
const copyFailed = ref(false)

const xShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(pageUrl.value)}`)
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`)
const linkedinShareUrl = computed(() => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`)
const blueskyShareUrl = computed(() => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${props.title} ${pageUrl.value}`)}`)
const pinterestShareUrl = computed(() => `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl.value)}&description=${encodeURIComponent(props.title)}${pageImage.value ? `&media=${encodeURIComponent(pageImage.value)}` : ''}`)

onMounted(() => {
  pageUrl.value = window.location.href
  pageImage.value = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content || ''
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copied.value = true
    copyFailed.value = false
    window.setTimeout(() => { copied.value = false }, 2200)
  } catch {
    copied.value = false
    copyFailed.value = true
    window.setTimeout(() => { copyFailed.value = false }, 2200)
  }
}
</script>
