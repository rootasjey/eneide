<template>
  <div class="site-page site-about bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
    <section class="max-w-7xl mx-auto px-6 py-28">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Typographic hero -->
        <div class="order-2 md:order-1">
          <h1 class="site-display-heading font-title font-extrabold text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tighter text-slate-900 dark:text-white animate-entrance" style="animation-delay:80ms;">{{ $t('pages.about.mainTitle') }}</h1>

          <p class="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl animate-entrance" style="animation-delay:220ms;">{{ $t('pages.about.intro') }}</p>

        </div>

        <!-- Cover image -->
        <div class="order-1 md:order-2">
          <div class="site-about-cover">
            <img src="/images/corpinot-cover.jpeg" :alt="$t('pages.about.coverAlt')" class="w-full h-80 object-cover md:h-[36rem] lg:h-[44rem]" />
          </div>
        </div>
      </div>
    </section>

    <section class="site-about-copy">
      <p>{{ $t('pages.about.description') }}</p>
      <p class="site-about-links">
        <NuxtLink :to="localizedPath('/posts', $getLocale())">{{ $t('pages.about.browsePosts') }}</NuxtLink>
        <span aria-hidden="true"> · </span>
        <a href="https://github.com/rootasjey/corpinot" target="_blank" rel="noopener">{{ $t('pages.about.openSource') }}</a>
      </p>
    </section>

    <section class="py-10 border-t border-gray-200/60 dark:border-gray-800/60">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-8xl font-serif font-bold">{{ $t('pages.about.openSourceHeading') }}</h2>
        <p class="mt-3 text-gray-600 dark:text-gray-300">{{ $t('pages.about.openSourceText') }}</p>
      </div>
    </section>

    <section class="py-12 border-t border-gray-200/60 dark:border-gray-800/60">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-8xl font-serif font-bold mb-6">{{ $t('pages.about.faqHeading') }}</h2>

        <NAccordion type="single" default-value="q1" accordion="divider border" class="bg-transparent text-2xl">
          <NAccordionItem value="q1" :label="$t('pages.about.faqWhoLabel')">
            <template #content>
              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('pages.about.faqWhoContent') }}</p>
            </template>
          </NAccordionItem>

          <NAccordionItem value="q2" :label="$t('pages.about.faqTopicsLabel')">
            <template #content>
              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('pages.about.faqTopicsContent') }}</p>
            </template>
          </NAccordionItem>

          <NAccordionItem value="q3" :label="$t('pages.about.faqOpenSourceLabel')">
            <template #content>
              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('pages.about.faqOpenSourceContent') }}</p>
            </template>
          </NAccordionItem>

          <NAccordionItem value="q4" :label="$t('pages.about.faqContributeLabel')">
            <template #content>
              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('pages.about.faqContributeContent') }}</p>
            </template>
          </NAccordionItem>

          <NAccordionItem value="q5" :label="$t('pages.about.faqNewsletterLabel')">
            <template #content>
              <p class="mt-2 text-gray-600 dark:text-gray-300">{{ $t('pages.about.faqNewsletterContent') }}</p>
            </template>
          </NAccordionItem>
        </NAccordion>
      </div>
    </section>

    <NewsletterSubscription />

    <section class="py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-serif font-bold">{{ $t('pages.about.contactHeading') }}</h2>
        <p class="mt-3 text-gray-600 dark:text-gray-300">{{ $t('pages.about.contactText') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { localizedPath } from '~/utils/presentationPosts'

const { $t, $getLocale } = useI18n()
const config = useRuntimeConfig()

useSeoMeta({
  title: $t('pages.about.metaTitle'),
  ogTitle: $t('pages.about.metaTitle'),
  description: $t('pages.about.metaDescription'),
  ogDescription: $t('pages.about.metaDescription'),
  ogUrl: `${config.public.siteUrl}/about`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/about` }],
})
</script>

<style scoped>
/* subtle entrance animation */
.animate-entrance {
  opacity: 0;
  transform: translateY(8px) scale(0.996);
  animation: entrance 640ms cubic-bezier(0.2,0.9,0.2,1) forwards;
}

@keyframes entrance {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-entrance {
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
