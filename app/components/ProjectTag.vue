<template>
  <span class="site-project-tag">{{ label }}</span>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style>
@layer components {
  .site-project-tag {
    display: inline-flex;
    min-height: 22px;
    align-items: center;
    padding-inline: 8px;
    border-radius: 6px;
    background: transparent;
    color: inherit;
    font-weight: 700;
    transform: scale(1);
    transition:
      background-color 180ms ease,
      color 180ms ease,
      transform 220ms ease;
  }

  .site-project-tag:hover,
  .site-home-project-card > a:focus-visible .site-project-tag,
  .site-demo-project:focus-visible .site-project-tag {
    background: var(--site-color-hover-background);
    color: var(--site-color-text);
    transform: scale(1.04);
  }

  @media (prefers-reduced-motion: reduce) {
    .site-project-tag {
      transition: none;
    }

    .site-project-tag:hover,
    .site-home-project-card > a:focus-visible .site-project-tag,
    .site-demo-project:focus-visible .site-project-tag {
      transform: none;
    }
  }
}
</style>
