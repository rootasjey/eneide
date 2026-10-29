# Design comparison workflow

`bun run design:compare -- posts` captures the public posts archive next to Core at the same viewport. It records computed typography and layout styles for article titles, dates, and tags, then repeats the capture with the tag hovered.

The command writes a local report to `.data/design-comparisons/`. Open its `index.html` to inspect the Core and local screenshots, a pixel difference image, and a per-property comparison table. The pixel percentage includes different copy and images, so use it as context rather than a pass/fail score; computed style values are listed separately.

The local development server must already be running at `localhost:3000`. Override its URL when needed:

```sh
bun run design:compare -- posts --local-url=http://localhost:3000/posts
```

To compare another page, add an entry to `scripts/design-comparison.config.json` with its reference and local URLs, viewport, element selectors, and any hover states. Use selectors that target the same visual role on both pages. The report is a local artifact and is ignored by Git.
