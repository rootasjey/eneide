<template>
  <footer class="site-footer border-t">
    <div class="site-footer-inner">
      <nav :aria-label="$t('footer.about')">
        <NuxtLink :to="localizedPath('/about', $getLocale())">{{ $t('footer.about') }}</NuxtLink>
        <NuxtLink :to="localizedPath('/credits', $getLocale())">{{ $t('footer.credits') }}</NuxtLink>
        <NuxtLink to="https://github.com/rootasjey/corpinot" external target="_blank">{{ $t('footer.gitHubRepository') }}</NuxtLink>
      </nav>

      <div class="site-footer-copyright">
        © {{ currentYear }}
        <NuxtLink to="https://github.com/rootasjey" external target="_blank">Jérémie CORPINOT</NuxtLink>.
        {{ $t('nav.tagline') }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { localizedPath } from '~/utils/presentationPosts'

const currentYear = new Date().getFullYear()
const { $getLocale, $t } = useI18n()
</script>
