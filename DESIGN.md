---
name: Arango UI contract
framework: React 19, React Router 7, Vite 8, plain CSS
colors:
  background: '#0a0c10'
  surface: 'rgba(18, 22, 28, 0.85)'
  text-primary: '#ffffff'
  text-secondary: '#cbd5e1'
  text-muted: '#9ba3af'
  accent: '#d8cbb8'
typography:
  body: Plus Jakarta Sans
  display: Space Grotesk
spacing:
  unit: 4px
  control-minimum: 44px
  section-gap: 4px to 28px
radius:
  gallery: 14px
  photograph: 9px
  selector: 8px
---

# Arango interface

The coming-soon page pairs construction photography with a dark industrial surface and warm neutral accents. Keep the existing logo, typefaces, colours and project imagery.

## Canonical components

- `Header`: brand identity and contact details.
- `WorksViewer`: region selectors, a project photograph, caption, horizontally scrolling thumbnails and enlarged photograph dialog.
- `Countdown`: launch information and four time units.
- `Footer`: company identity, location and background slideshow indicators.

`src/index.css` owns shared tokens and component styles. `src/App.css` owns the application root. Extend these styles without adding another CSS framework.

## Responsive contract

The page fits the available viewport without page scrolling. The photograph thumbnail strip is the only horizontally scrollable region; other content has no inner scrolling. Header, main content and footer use a bounded grid; the photograph absorbs the remaining height. Keep the title, region selectors, photograph, launch date and countdown visible. Do not shrink the entire page or conceal oversized content with overflow clipping.

Body descriptions and contacts start at 16px; supporting labels start at 12px. Narrow layouts use 14px contacts, and viewports at most 500px tall use 10px footer text to preserve the photograph and primary controls. Keep prose independently constrained and the gallery centred with a maximum width of 1280px. Desktop gallery height is capped at 640px, or 800px for the full-width photograph composition on tall screens. Photograph proportions follow the available width and height instead of imposing a minimum image ratio.

On narrow screens, centre the launch label above its date, including when the date wraps onto two lines.

Portrait tablets use a centred gallery no taller than 54% of the viewport, with a 16:9 photograph and compact caption and thumbnail rows below it. The gallery width follows its height budget and is capped at 768px. Phone layouts retain their existing sizing.

Use one gallery column until photograph and caption fit side by side. Wide viewports at least 1600px tall return to a full-width photograph with a compact caption and thumbnail row below it. Region names wrap. The thumbnail strip retains every photograph and supports arrows, mouse wheel, horizontal trackpad movement and native touch scrolling. Scrolling does not select a photograph; clicking a thumbnail does. Keep short lists centred and the selected photograph visible after navigation or resizing. Reset the strip when changing regions. Selectors, thumbnail buttons and navigation controls have at least 44px touch targets. The enlargement hint remains visible on touch devices.

Short viewports condense spacing and secondary copy. Very short viewports use photograph arrows instead of thumbnails; the existing enlargement dialog supplies the project caption. Compact launch information retains the date. Viewports at most 240px tall hide the secondary footer, compact the logo and contacts, and reserve at least 44px for photograph controls. Keep the original page components without adding secondary information screens or controls.

## Photograph dialog

Use a native modal `dialog` with `.lightbox-overlay` and a `.lightbox-content` child. Only the open dialog is displayed; its backdrop dims the page. Keep the close control in the layout, fit the image to the height remaining after the caption, and wrap captions without scrolling. Preserve keyboard focus, Escape dismissal and focus restoration through the native dialog lifecycle.

Apply safe-area insets to page and dialog padding. Respect reduced-motion preferences for image and control transitions.
