<template>
  <div class="min-h-screen flex flex-col font-text site-shell">
    <header class="site-banner relative z-10" role="banner">
      <AppHeader />
    </header>
    <main class="flex-1 pb-20 md:pb-0">
      <slot />
    </main>
    <BottomPageBlur />
    <AppFooter class="hidden md:block" />
    <MobileBottomNav class="lg:hidden" />
  </div>
</template>

<style>
@layer components {

/* Component and page styles moved from the global stylesheets. */
.site-shell .site-banner { position: relative; top: auto; transform: none; box-shadow: none; }
.site-shell > main:has(> .site-auth-page),
.site-shell > main:has(> .site-error-page) {
  display: flex;
  flex-direction: column;
}
}
</style>
