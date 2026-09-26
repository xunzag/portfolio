# Farhan Babar — Dreamscape

A scroll-driven 3D portfolio. One continuous camera film through a glowing dreamscape:

1. **Intro** — Guts (Berserk) crouched on a floating island, glowing Brand beneath him.
2. **Work** — each project is a floating hologram on its own crystal island, with 3D type, metrics and clickable 3D buttons.
3. **About** — bio, stats and a career timeline as light in the sky.
4. **Facts** — an orbit of glowing numbers from `/etc/farhan.conf`, plus setup and principles.
5. **Stack** — a floating shrine: the Ghost of Tsushima Storm Blade hovers, the toolbelt orbits it, skill bars of light grow beside it.
6. **Life** — the camera flies through a vortex gate into an anime realm (Eren, Hisoka, posters, quotes, hobbies).
7. **Contact** — a holographic form projected in 3D, plus 3D buttons.

Everything visible is WebGL. The DOM only carries the hero type and a screen-reader/SEO copy of all the content.

## Stack
Next.js 16 · React 19 · three.js / R3F / drei · postprocessing · GSAP + Lenis · zustand · Tailwind v4

## Content
All copy lives in `lib/content.ts`. Realm characters are `public/models/char-1.glb` (Eren) and `char-2.glb` (Hisoka); add `char-3.glb` for the third island. Models are compressed with `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp --texture-size 1024 --compress meshopt`.

## Performance
- Worlds outside the current scroll zone neither render nor animate.
- One shadow-casting light. Bloom is the only heavy pass; the low tier drops the rest.
- `?quality=low` or `?quality=high` in the URL forces a tier.

## Credits
- Guts (Berserker Armor), Eren, Hisoka and the Storm Blade models: Sketchfab (see each model page for its author and license).
- Inter font: OFL-1.1.

## Develop
```bash
npm install && npm run dev
```
