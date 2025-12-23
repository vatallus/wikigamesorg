# v0.dev Deployment Instructions - Wikigames.org

To reproduce or deploy the **Wikigames.org** aesthetic on v0.dev or shadcn/ui platforms, follow these guidelines:

## 1. Core Visual Directives
- **Theme**: Dark Mode by default. Primary colors: `#1e1b4b` (Deep Indigo), `#f43f5e` (Crimson), `#4ade80` (Green).
- **Background**: Use a subtle SVG grid pattern with low opacity (5%).
- **Components**: Use **Glassmorphism**. Transparent backgrounds (`rgba(255, 255, 255, 0.05)`), `backdrop-filter: blur(20px)`, and `1px solid rgba(255, 255, 255, 0.1)` borders.

## 2. Component Architecture
When building on v0, ensure the following hierarchy:
- `Hub`: A persistent floating navigation component with absolute positioning.
- `BattleStats`: High-visibility typography for scores and timers (900 weight).
- `Timeline`: Horizontal scrollable container with interactive drop zones.

## 3. Key CSS Tokens
```scss
$primary: #f43f5e;
$secondary: #4ade80;
$dark-bg: #1e1b4b;
$glass: rgba(255, 255, 255, 0.05);
$animation-fast: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## 4. Prompting strategy for v0
If you want to recreate the **Time Battle** UI, use this prompt fragment:
> "Create a high-energy dashboard for a time-based trivia game. Navy blue gradient background with a subtle grid. Large crimson timer at the top with a neon glow effect. Interactive cards in the center with glassmorphism. Use Inter or Outfit font family for a premium feel."
