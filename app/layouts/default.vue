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
