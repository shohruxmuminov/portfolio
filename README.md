# Shohrux — Portfolio

An interactive 3D portfolio for Shohrux, a developer and AI product builder from Uzbekistan.

**Stack:** Next.js (App Router) + TypeScript, Three.js, GSAP (ScrollTrigger + SplitText), Lenis smooth scroll, CSS Modules.

## What's on the page

- **A particle sculpture with ~14,000 points** (`src/components/experience/ParticleField.tsx`). One fixed WebGL canvas sits behind the page, and as you scroll it morphs into a different 3D figure for each section:
  - hero: an orb with a ring
  - IELTS: stacked exam sheets
  - S.H.O.H.R.U.X AI: a neural network
  - Orbit OS: a planet with orbits and windows
  - Street Walker: a wireframe city
  - Mechanical Watch: gears and a balance wheel
  - About through Process: a spiral galaxy
  - Contact: the name **SHOHRUX**

  Particles ripple away from the cursor, and each morph passes through a short burst of turbulence.
- **Intro loader** with a counter and letter reveal. It's quick on repeat visits.
- **Custom cursor** that grows over links and shows labels like "Open", "Drag" and "Hi!".
- **Text animation:** split-letter headings, a scroll-highlighted About paragraph and parallax project numbers.
- **Velocity marquee** that speeds up and skews with your scroll.
- **Focus cards** with pure-CSS 3D objects (layered windows, an atom, a tile wave, a cube inside a cube), 3D tilt and a spotlight.
- **Draggable 3D tool sphere**, a process path that draws itself, magnetic buttons, a live Uzbekistan clock and a hide-on-scroll navbar.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin for correct link previews.

## Update content

| What | Where |
| --- | --- |
| Copy, projects, statuses, toolkit, process | `src/data/portfolio.ts` |
| Email, social links, footer credit | `src/config/site.ts` |
| Portrait | `public/images/shohrux-portrait.webp` |
| 3D shapes | `src/lib/shapes.ts` (one generator per figure) |

- **Contact:** contact fields left empty are hidden. Nothing fake is ever shown.
- **Project links** appear only when `links.repo` or `links.demo` is set.
- **Pairing projects with shapes:** a section asks for a figure with `data-shape="n"`. Its position can be nudged with `data-lx/ly/ls/lo` on desktop and `data-mx/my/ms/mo` on mobile.

## Performance & accessibility

- **Point count:** 14k points on desktop, and 7k on phones or machines with 4 CPU cores or fewer. Pixel ratio is capped at 1.75.
- **Idle cost:** rendering pauses when the tab is hidden, and CSS animation loops pause when they're off screen.
- **Reduced motion:** with `prefers-reduced-motion`, there's no loader, smooth scroll, turbulence or text animation. All content is visible immediately.
- **No JavaScript:** without JS, the page renders fully readable, with no loader and no canvas.
- **Accessibility:** one H1, a skip link, a keyboard-accessible mobile menu, alt text, and a visible text version of everything shown in the 3D tool sphere.

## Images

- `assets-src/portrait/originals/` holds untouched source photos. They aren't served.
- `assets-src/portrait/process_portrait.py` crops and gently tones the web portrait. It doesn't change the face.
- `assets-src/make_og.py` generates `public/og.png`.
