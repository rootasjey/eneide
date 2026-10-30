<template>
  <div class="site-bottom-blur" aria-hidden="true">
    <div v-for="layer in 8" :key="layer" />
  </div>
</template>

<style>
@layer components {

/* Component and page styles moved from the global stylesheets. */
.site-shell .site-bottom-blur { position: sticky; z-index: 10; bottom: 0; height: 80px; flex: 0 0 80px; pointer-events: none; }
.site-shell .site-bottom-blur > div { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.site-shell .site-bottom-blur > :nth-child(1) { backdrop-filter: blur(0.0781px); -webkit-backdrop-filter: blur(0.0781px); mask: linear-gradient(transparent, #000 12.5%, #000 25%, transparent 37.5%); -webkit-mask: linear-gradient(transparent, #000 12.5%, #000 25%, transparent 37.5%); }
.site-shell .site-bottom-blur > :nth-child(2) { backdrop-filter: blur(0.1563px); -webkit-backdrop-filter: blur(0.1563px); mask: linear-gradient(transparent 12.5%, #000 25%, #000 37.5%, transparent 50%); -webkit-mask: linear-gradient(transparent 12.5%, #000 25%, #000 37.5%, transparent 50%); }
.site-shell .site-bottom-blur > :nth-child(3) { backdrop-filter: blur(0.3125px); -webkit-backdrop-filter: blur(0.3125px); mask: linear-gradient(transparent 25%, #000 37.5%, #000 50%, transparent 62.5%); -webkit-mask: linear-gradient(transparent 25%, #000 37.5%, #000 50%, transparent 62.5%); }
.site-shell .site-bottom-blur > :nth-child(4) { backdrop-filter: blur(0.625px); -webkit-backdrop-filter: blur(0.625px); mask: linear-gradient(transparent 37.5%, #000 50%, #000 62.5%, transparent 75%); -webkit-mask: linear-gradient(transparent 37.5%, #000 50%, #000 62.5%, transparent 75%); }
.site-shell .site-bottom-blur > :nth-child(5) { backdrop-filter: blur(1.25px); -webkit-backdrop-filter: blur(1.25px); mask: linear-gradient(transparent 50%, #000 62.5%, #000 75%, transparent 87.5%); -webkit-mask: linear-gradient(transparent 50%, #000 62.5%, #000 75%, transparent 87.5%); }
.site-shell .site-bottom-blur > :nth-child(6) { backdrop-filter: blur(2.5px); -webkit-backdrop-filter: blur(2.5px); mask: linear-gradient(transparent 62.5%, #000 75%, #000 87.5%, transparent); -webkit-mask: linear-gradient(transparent 62.5%, #000 75%, #000 87.5%, transparent); }
.site-shell .site-bottom-blur > :nth-child(7) { backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); mask: linear-gradient(transparent 75%, #000 87.5%, #000); -webkit-mask: linear-gradient(transparent 75%, #000 87.5%, #000); }
.site-shell .site-bottom-blur > :nth-child(8) { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); mask: linear-gradient(transparent 87.5%, #000); -webkit-mask: linear-gradient(transparent 87.5%, #000); }
}
</style>
