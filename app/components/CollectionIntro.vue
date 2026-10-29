<template>
  <section class="site-collection-intro">
    <img class="site-collection-avatar" src="/images/presentation/jc-pp.jpg" alt="Jérémie Corpinot" width="100" height="100">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>
