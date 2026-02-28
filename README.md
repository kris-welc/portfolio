# Portfolio

Personal portfolio site with a post-apocalyptic cyberpunk aesthetic. Built with Next.js, shadcn/ui, and Tailwind CSS.

## Stack

- **Framework**: Next.js 16 (App Router, static export)
- **UI**: shadcn/ui (Card, Badge, Button, Separator) + Radix primitives
- **Styling**: Tailwind CSS v4 with custom wasteland theme
- **Fonts**: Chakra Petch (display), Rajdhani (body), Share Tech Mono (mono)
- **Deployment**: GitHub Pages (static export)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Wasteland theme + CSS effects (grain, scanlines, vignette)
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Page composition
├── components/
│   ├── ui/              # shadcn primitives (card, badge, button, separator)
│   ├── nav.tsx          # Fixed navigation bar
│   ├── hero.tsx         # Hero with domain tags
│   ├── project-card.tsx # Individual project card with metrics
│   ├── projects-section.tsx
│   ├── systems-section.tsx
│   ├── stack-section.tsx
│   ├── contact-section.tsx
│   ├── footer.tsx
│   ├── icons.tsx        # SVG icon components
│   ├── section-label.tsx    # Terminal-style section headers
│   ├── status-indicator.tsx # Pulsing live indicator
│   └── wasteland-badge.tsx  # Themed badge variants
├── hooks/
│   └── use-reveal.ts   # Scroll-triggered reveal animation
└── lib/
    ├── data.ts          # All project/content data (typed, immutable)
    └── utils.ts         # shadcn utility (cn)
```

## Design System

### Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `waste-bg` | `#0a0908` | Page background |
| `waste-panel` | `#18160f` | Card/panel backgrounds |
| `waste-amber` | `#d97706` | Primary accent (radiation/warning) |
| `waste-toxic` | `#84cc16` | Secondary accent (radioactive green) |
| `waste-rust` | `#b91c1c` | Danger/destructive accent |
| `waste-bone` | `#d4c8a8` | Primary text |
| `waste-sand` | `#a89a7c` | Secondary text |
| `waste-dim` | `#6b6352` | Muted text |

### Effects

- **Scanlines**: CSS repeating gradient overlay
- **Film grain**: Animated SVG noise texture
- **CRT vignette**: Radial gradient darkening edges
- **Corner brackets**: CSS pseudo-elements on cards
- **Title flicker**: Keyframe opacity animation
- **Scroll reveal**: IntersectionObserver fade-in

## Adding Content

Edit `src/lib/data.ts` to add projects, stack items, or links. All content is typed with TypeScript interfaces.

## Deployment

### GitHub Pages

1. Add to `next.config.ts`:
   ```ts
   output: 'export',
   basePath: '/portfolio',
   ```
2. Push to `main` — configure GitHub Pages to deploy from Actions

### Vercel

Push to GitHub and import in Vercel. Zero config needed.

## Enhancement Ideas

- [ ] Project detail pages with expanded case studies
- [ ] Live system status indicators (pull from GCP)
- [ ] Blog/writing section
- [ ] Dark/light theme toggle (wasteland stays dark, add a "clean" mode)
- [ ] Animated background (WebGL particles or noise field)
- [ ] Mobile hamburger nav
- [ ] Analytics (Plausible or Umami)
