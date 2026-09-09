# Vibeployed — product UI

Marketing site and interactive product demo for Vibeployed: connect a repository
and a cloud account, and see the architecture, the security findings and the
monthly bill before a single resource is created.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the built bundle
npm run lint
```

Routing uses `BrowserRouter`, so when you host `dist/` statically, add a
SPA fallback rewriting unknown paths to `/index.html` — otherwise a hard refresh
on `/console` 404s.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Framer Motion · React Router ·
lucide-react · react-icons · @number-flow/react. No UI kit — every component is local.

Note this is a plain Vite app, not Next.js and not a shadcn project: there is no
`@/` path alias and no `components/ui` convention from the CLI. Components live
under `src/components/`, and anything copied in from elsewhere is adapted to
that (no `next/image`, no `"use client"`).

## Theme

**Graphite Mono** — https://21st.dev/community/themes/graphite-mono (serafimcloud).

A strictly neutral system. Surfaces, borders and text are pure greyscale, and
cards sit *darker* than the page, which is the theme's own depth model — so
panels are flat and bordered rather than glassy.

The single chromatic exception is `destructive`, reserved for genuine risk
(critical findings, the breach-scenario card). Everything that would normally
carry colour — severity levels, cost line items, diagram nodes — is separated
by **luminance bands** instead: `gold` (brightest, primary actions), `jade`,
`bronze`, `sand`, and `clay` (the red). Those ramps are defined once in
`src/index.css`, so re-theming means editing that file and nothing else.

Type is DM Sans + Geist Mono from the theme, with **Instrument Serif** for
large display headings. The serif ships a single 400 weight, so display text
carries no font-weight classes — adding one would trigger faux-bold.

## Routes

| Route      | What it is                                                     |
| ---------- | -------------------------------------------------------------- |
| `/`        | Landing page — hero, pipeline, modes, architecture, cost explorer, guardrails, pricing, FAQ |
| `/console` | The six-step run: repository → cloud → scan → sizing → design → deploy |

## Layout

```
src/
  lib/
    data.ts        clouds, modes, pipeline copy, scan findings, pricing, FAQ
    cost.ts        the sizing + cost model (shared by landing and console)
    run.ts         console run state and step definitions
    utils.ts       cn(), currency and clamp helpers
  components/
    ui/            Aurora, SpotlightCard, Magnetic, Reveal, Marquee,
                   AnimatedNumber, ArchitectureDiagram, Logo, Kit (Button etc.)
    landing/       one file per landing section
    console/       one file per run step, plus the stepper and step shell
  pages/
    Landing.tsx    composes the landing sections
    Console.tsx    owns run state and drives the step machine
```

### The cost model

`lib/cost.ts` is the single source of truth for sizing and pricing. Both the
landing page's cost explorer and the console's design step call `estimate()`
with the same four answers, so the two never disagree. Every line item carries
the quantity it was priced on, and `savingsHints()` derives its suggestions from
the same answers.

The numbers are an illustrative model built for the demo — realistic in shape
and in the relationships between inputs, but not wired to live provider price
lists. Swap `estimate()` for a real pricing API when there is one.

### The architecture diagram

`ui/ArchitectureDiagram.tsx` lays nodes out on a 5×3 lattice, measures the
container with a `ResizeObserver`, and draws bezier wires between the facing
edges of each card. It renders both the high-level and low-level views from the
same node list — `LLD_SPECS` and `EDGE_LABELS` supply the extra detail — so the
two views can never drift apart. The whole lattice animates from one
`useInView` trigger on the container rather than per node, so rows below the
fold still appear.

## Motion

Animation is centralised so it stays consistent:

- `ui/Reveal.tsx` — scroll reveals and stagger groups, one shared easing curve
- `ui/ContainerScroll.tsx` — the 3D scroll reveal on the architecture section
- `ui/TextRoll.tsx` — letter-by-letter roll on the nav links
- `ui/AnimatedNumber.tsx` — NumberFlow odometers for figures and money
- `ui/Aurora.tsx` — the ambient backdrop
- `ui/Spotlight.tsx` — cursor-following glow on cards
- `ui/Magnetic.tsx` — buttons that lean toward the pointer
- keyframes live in `index.css` alongside the Tailwind theme

### Third-party components

Two components are adapted from external sources and carry attribution in
their file headers:

- `ui/TextRoll.tsx` — Skiper UI (Skiper58) by @gurvinder-singh02.
  The Skiper UI free licence **requires attribution** — keep the header
  comment, and add a visible credit if you ship the free tier.
- `ui/ContainerScroll.tsx` — Aceternity UI's container-scroll-animation,
  rewritten for Vite and the Graphite Mono surfaces.

Every animated component honours `prefers-reduced-motion`, and `index.css` has a
global reduced-motion block as a backstop.

## Before launch

The copy, pricing tiers and the metrics in the guardrails strip are placeholders
written to demonstrate the layout — replace them with your own claims, and make
sure anything stated as fact is one you can stand behind.
