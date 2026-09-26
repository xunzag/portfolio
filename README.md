# Farhan Babar — 3D Dev Room

An interactive 3D portfolio: a cosy late-night developer room you can click around in.

| Object | Opens |
| --- | --- |
| 🖥 Monitor | **Work**: the screen live-loads whichever project you pick |
| 📚 Bookshelf | **About**: bio, stats, career `git log` |
| 💻 Glass PC tower | **Stack**: skills and toolbelt |
| 🖼 Poster wall / guitar | **Life**: anime and hobbies |
| 📱 Phone | **Contact**: EmailJS form and socials |

Easter eggs: <kbd>Ctrl</kbd>+<kbd>`</kbd> (or click the keyboard) opens a terminal, the desk lamp toggles the lights, the rubber duck on the PC gives debugging advice, and the Konami code (↑↑↓↓←→←→BA) starts a party.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- three.js + @react-three/fiber + drei, with postprocessing bloom
- zustand for room state, Motion for UI animation, Tailwind CSS v4

Everything in the room is procedural (built in code, no model files). Downloaded
assets are the photo/poster/screenshot textures and a few CC0 normal maps (`public/tex`),
plus a CC0 HDRI for reflections (`public/env/apartment.exr`, via `@pmndrs/assets` / Poly Haven).

### Motion
- **Intro:** the room builds itself (floor rises, walls unfold, furniture drops in) with GSAP.
- **Stack:** the PC's glass door swings open, the parts float out in an exploded view, and the toolbelt orbits it.
- **About:** favourite books slide off the shelf and the photo frame floats out.
- **Life:** the posters peel off the wall and fan out.
- **Contact:** the phone lifts off its dock and turns to face you.
- **Work:** a scanline wipe on the monitor and a ripple across the keyboard when you switch projects.
- The desk lamp follows your cursor, and the chair spins when clicked.

## Performance

- `PerformanceMonitor` and `AdaptiveDpr` drop the pixel ratio and turn off post-processing on slow GPUs.
- Weak and small devices start in low-quality mode.
- One shadow-casting light; instanced books and keycaps; blob contact shadows.
- High tier adds N8AO ambient occlusion, a reflective floor, bloom and a hover outline. The low tier drops all of these.
- The 3D canvas is client-only (`ssr: false`). A screen-reader-only copy of all content is server-rendered for SEO and accessibility.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

Content lives in `lib/content.ts`. Edit projects, experience, skills and anime there.
