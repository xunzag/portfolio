# Farhan Babar — Dreamscape

A scroll-driven 3D portfolio. One continuous camera film through a glowing dreamscape:

1. **Intro** — Guts (Berserk) crouched on a floating island, glowing Brand beneath him.
2. **Work** — each project is a floating hologram on its own crystal island, with 3D type, metrics and clickable 3D buttons.
3. **About** — bio, stats and a career timeline as light in the sky.
4. **Facts** — an orbit of glowing numbers from `/etc/farhan.conf`, plus setup and principles.
5. **Stack** — the dev room: the PC opens into an exploded view, the stack orbits it and skill bars grow beside it.
6. **Life** — the camera dives through the monitor into an anime realm (posters, quotes, hobbies).
7. **Contact** — a holographic form projected in 3D, plus 3D buttons.

Everything visible is WebGL. The DOM only carries the hero type and a screen-reader/SEO copy of all the content.

## Stack
Next.js 16 · React 19 · three.js / R3F / drei · postprocessing · GSAP + Lenis · zustand · Tailwind v4

## Content
All copy lives in `lib/content.ts`. Drop `char-1.glb` … `char-3.glb` into `public/models/` to place characters on the realm islands.

## Performance
- Worlds outside the current scroll zone neither render nor animate.
- One shadow-casting light. Bloom is the only heavy pass; the low tier drops the rest.
- `?quality=low` or `?quality=high` in the URL forces a tier.

## Credits
- Guts / Berserker Armor model: Sketchfab (see the model page for its author and license).
- Inter font: OFL-1.1.
- HDRI and normal maps: CC0 via @pmndrs/assets.

## Develop
```bash
npm install && npm run dev
```
