<template>
  <div class="site-post-share-actions" role="group" :aria-label="$t('components.postShare.label')">
    <a
      :href="xShareUrl"
      :aria-label="$t('components.postShare.x')"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="i-ph-x-logo" aria-hidden="true" />
    </a>
    <a
      :href="facebookShareUrl"
      :aria-label="$t('components.postShare.facebook')"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="i-ph-facebook-logo" aria-hidden="true" />
    </a>
    <a :href="emailShareUrl" :aria-label="$t('components.postShare.email')">
      <span class="i-ph-envelope-simple" aria-hidden="true" />
    </a>
    <button type="button" :aria-label="$t('components.postShare.copy')" @click="copyLink">
      <span class="i-ph-copy" aria-hidden="true" />
    </button>
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
const copied = ref(false)
const copyFailed = ref(false)

const xShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(pageUrl.value)}`)
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`)
const emailShareUrl = computed(() => `mailto:?subject=${encodeURIComponent(props.title)}&body=${encodeURIComponent(pageUrl.value)}`)

onMounted(() => {
  pageUrl.value = window.location.href
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
