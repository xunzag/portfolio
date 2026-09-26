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

Everything in the room is procedural (built in code, no model files). Only the
photo, poster and project-screenshot textures are downloaded (~700 KB of WebP in `public/tex`).

## Performance

- `PerformanceMonitor` and `AdaptiveDpr` drop the pixel ratio and turn off post-processing on slow GPUs.
- Weak and small devices start in low-quality mode.
- Instanced meshes for books and keycaps; baked contact shadows (`frames={1}`); no real-time shadow maps.
- The 3D canvas is client-only (`ssr: false`). A screen-reader-only copy of all content is server-rendered for SEO and accessibility.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

Content lives in `lib/content.ts`. Edit projects, experience, skills and anime there.
