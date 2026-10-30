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
@layer components {

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
    transition: none;
    animation: none;
    opacity: 1;
    transform: none;
  }
}
}
</style>

<style>
@layer components {

/* Component and page styles moved from the global stylesheets. */
.site-shell .site-about > section:first-child { width: min(700px, calc(100vw - 32px)); margin-inline: auto; padding: 60px 0 64px; }
.site-shell .site-about > section:first-child > div { display: flex; flex-direction: column; gap: 52px; }
.site-shell .site-about > section:first-child > div > div:first-child { order: 1; max-width: 700px; }
.site-shell .site-about > section:first-child > div > div:last-child { order: 2; }
.site-shell .site-about h1.site-display-heading { max-width: 700px; margin: 0; color: var(--site-color-heading); font-size: 20px; font-weight: 550; letter-spacing: 0; line-height: 28px; }
.site-shell .site-about > section:first-child p:not(.site-about-eyebrow) { max-width: 700px; margin-block: 20px 0; color: var(--site-color-text); font-size: 16px; line-height: 24px; }
.site-shell .site-about .site-about-cover { width: 720px; max-width: calc(100vw - 32px); margin-left: -10px; overflow: hidden; border-radius: 24px; }
.site-shell .site-about .site-about-cover img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
.site-shell .site-about > section:first-child .btn { min-height: auto; padding: 0; border: 0; background: transparent; color: var(--site-color-accent); font-size: 14px; text-decoration: underline; text-underline-offset: 3px; }
.site-shell .site-about > section:not(:first-child) { width: min(700px, calc(100vw - 32px)); margin-inline: auto; padding: 40px 0; border-color: var(--site-color-border); }
.site-shell .site-about > section:not(:first-child) > div { max-width: 700px; margin-inline: auto; padding-inline: 0; }
.site-shell .site-about h2 { margin: 0 0 16px; color: var(--site-color-heading); font-family: var(--site-font-body); font-size: 20px; font-weight: 550; line-height: 28px; }
.site-shell .site-about .text-8xl { font-size: 20px; line-height: 28px; }
.site-shell .site-about .text-2xl { font-size: 16px; line-height: 24px; }
.site-shell .site-about .text-gray-600,
.site-shell .site-about .text-gray-700 { color: var(--site-color-muted); }
.site-shell .site-about > section:last-child > div { text-align: left; }
.site-shell .site-about-copy { width: min(700px, calc(100vw - 32px)); margin-inline: auto; padding: 0 0 40px; color: var(--site-color-text); font-size: 16px; line-height: 1.7; }
.site-shell .site-about-copy p { margin: 0 0 24px; }
.site-shell .site-about-copy a { color: var(--site-color-accent); }
.site-shell .site-about > section:first-child { width: min(700px, calc(100% - 32px)); max-width: 700px; margin-inline: auto; }
}
</style>
