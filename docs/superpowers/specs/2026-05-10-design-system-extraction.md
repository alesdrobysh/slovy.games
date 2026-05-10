# Design System Extraction — Slovy Games

## Context

Slovy Games has two games (Valoshka + Pobach) sharing a hub, with significant duplication and inconsistency across components, tokens, and styling. This spec describes extracting a unified design system from the existing codebase.

### Decisions

- **Scope**: Full system — tokens, components, patterns
- **Styling**: Tailwind-first with CSS variables for theming
- **Location**: `src/shared/` (expand existing)
- **Approach**: Incremental layered extraction (Approach A)

---

## 1. Token System

### 1.1 Problem

Two parallel naming conventions exist:
- `--color-X` (newer, in `:root` and theme overrides)
- `--X` (older, in component inline styles)

Inline pixel values for spacing, font-sizes, and radii are scattered across components without a consistent scale.

### 1.2 Solution: Three-Layer Token Hierarchy

```
Primitive → Semantic → Component
```

All tokens prefixed `--sly-` to namespace and distinguish from legacy names.

### 1.3 Primitive Tokens

Raw values, not theme-aware. Defined once in `:root`.

**Colors:**

```css
:root {
  /* --- Neutral / Warm palette (Hub default) --- */
  --sly-warm-50:  #f7f3ed;
  --sly-warm-100: #ede3d5;
  --sly-warm-200: #e2d5c5;
  --sly-warm-300: #d4c8ac;
  --sly-warm-600: #7a6848;
  --sly-warm-800: #6b5a51;
  --sly-warm-900: #2c1f0e;
  --sly-warm-950: #1b120e;

  /* --- Blue accent (Valoshka / Hub) --- */
  --sly-blue-500: #5b6fa8;
  --sly-blue-400: #8094c8;
  --sly-blue-300: #9aaee0;
  --sly-blue-600: #3a4f80;

  /* --- Orange accent (Pobach) --- */
  --sly-orange-500: #e58e3f;
  --sly-orange-400: #f0a860;
  --sly-orange-600: #c07030;

  /* --- Green (Success / Rank-1) --- */
  --sly-green-500: #16a34a;
  --sly-green-400: #84cc16;

  /* --- Blue (Info / Rank-default) --- */
  --sly-info-500: #4b83c8;

  /* --- Error --- */
  --sly-red-500: #ef4444;

  /* --- Typography sizes (1.25 ratio between steps) --- */
  --sly-text-xs:   0.75rem;    /* 12px — labels, badges */
  --sly-text-sm:   0.875rem;   /* 14px — body small */
  --sly-text-base: 1rem;       /* 16px — body */
  --sly-text-lg:   1.125rem;   /* 18px — emphasized */
  --sly-text-xl:   1.25rem;    /* 20px — card titles */
  --sly-text-2xl:  1.5rem;     /* 24px — section headings */
  --sly-text-3xl:  1.875rem;   /* 30px — page titles */
  --sly-text-4xl:  2.25rem;    /* 36px — display */
  --sly-text-5xl:  3rem;       /* 48px — hero */

  /* --- Font weights --- */
  --sly-weight-normal: 400;
  --sly-weight-medium: 500;
  --sly-weight-semibold: 600;
  --sly-weight-bold: 700;

  /* --- Spacing (4pt scale) --- */
  --sly-space-1:  0.25rem;   /* 4px */
  --sly-space-2:  0.5rem;    /* 8px */
  --sly-space-3:  0.75rem;   /* 12px */
  --sly-space-4:  1rem;      /* 16px */
  --sly-space-5:  1.25rem;   /* 20px */
  --sly-space-6:  1.5rem;    /* 24px */
  --sly-space-8:  2rem;      /* 32px */
  --sly-space-10: 2.5rem;    /* 40px */
  --sly-space-12: 3rem;      /* 48px */
  --sly-space-16: 4rem;      /* 64px */
  --sly-space-20: 5rem;      /* 80px */
  --sly-space-24: 6rem;      /* 96px */

  /* --- Border radius --- */
  --sly-radius-sm:   6px;
  --sly-radius-md:   8px;
  --sly-radius-lg:  12px;
  --sly-radius-xl:  16px;
  --sly-radius-2xl: 24px;
  --sly-radius-full: 9999px;

  /* --- Shadows --- */
  --sly-shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --sly-shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1);
  --sly-shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1);
  --sly-shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1);

  /* --- Transitions --- */
  --sly-duration-fast: 150ms;
  --sly-duration-normal: 250ms;
  --sly-duration-slow: 400ms;
  --sly-easing: cubic-bezier(0.4, 0, 0.2, 1);

  /* --- Fonts --- */
  --sly-font-display: "EB Garamond", serif;
  --sly-font-sans: "Manrope", sans-serif;
}
```

### 1.4 Semantic Tokens

Theme-aware. Default values for Hub (neutral warm), overridden per game theme.

```css
:root {
  /* --- Hub / Neutral (light) --- */
  --sly-bg:         var(--sly-warm-50);
  --sly-bg-card:    var(--sly-warm-100);
  --sly-bg-surface: var(--sly-warm-200);
  --sly-text:       var(--sly-warm-900);
  --sly-text-muted: var(--sly-warm-600);
  --sly-border:     var(--sly-warm-300);
  --sly-accent:           var(--sly-blue-500);
  --sly-accent-subtle:    rgba(91, 111, 168, 0.1);
  --sly-accent-border:    rgba(91, 111, 168, 0.22);
  --sly-accent-light:     var(--sly-blue-400);
  --sly-accent-dark:      var(--sly-blue-600);
}

html.dark {
  --sly-bg:         #0e0f1a;
  --sly-bg-card:    #161828;
  --sly-bg-surface: #1e2138;
  --sly-text:       #e8e4d8;
  --sly-text-muted: #7a7a9a;
  --sly-border:     #2a2d48;
  --sly-accent:           #7a8fc8;
  --sly-accent-subtle:    rgba(122, 143, 200, 0.12);
  --sly-accent-border:    rgba(122, 143, 200, 0.25);
  --sly-accent-light:     #9aaee0;
  --sly-accent-dark:      #5b6fa8;
}

/* Pobach overrides */
.theme-pobach {
  --sly-accent:     var(--sly-orange-500);
  --sly-accent-subtle:  rgba(229, 142, 63, 0.1);
  --sly-accent-border:   rgba(229, 142, 63, 0.22);
  --sly-accent-light:    var(--sly-orange-400);
  --sly-accent-dark:     var(--sly-orange-600);
  /* bg/text/border for pobach light and dark */
}

/* Valoshka overrides */
.theme-valoshka {
  --sly-accent: var(--sly-blue-500);
  /* same pattern */
}
```

### 1.5 Component Tokens

Game-specific named tokens live in the theme scope:

```css
.theme-pobach {
  --sly-rank-1:       var(--sly-green-500);
  --sly-rank-10:      var(--sly-green-500);
  --sly-rank-100:     var(--sly-green-400);
  --sly-rank-1000:    var(--sly-orange-500);
  --sly-rank-default: var(--sly-info-500);
  --sly-attempts-base:  var(--sly-orange-500);
  --sly-attempts-1:     color-mix(in oklab, var(--sly-attempts-base) 100%, black 0%);
  --sly-attempts-10:    color-mix(in oklab, var(--sly-attempts-base) 85%, black 15%);
  --sly-attempts-50:    color-mix(in oklab, var(--sly-attempts-base) 70%, black 30%);
  --sly-attempts-100:   color-mix(in oklab, var(--sly-attempts-base) 55%, black 45%);
  --sly-attempts-many:  color-mix(in oklab, var(--sly-attempts-base) 40%, black 60%);
}

.theme-valoshka {
  --sly-cornflower:              var(--sly-blue-500);
  --sly-cornflower-dark:         var(--sly-blue-600);
  --sly-cornflower-light:       var(--sly-blue-400);
  --sly-cornflower-bg-subtle:    rgba(91, 111, 168, 0.1);
  --sly-cornflower-border-subtle: rgba(91, 111, 168, 0.22);
  --sly-cell-center:        #252850;
  --sly-cell-outer:         #7b9cf0;
  --sly-cell-center-hover:  #2a3670;
  --sly-cell-outer-hover:   #6a88e0;
  --sly-cell-letter-center: #fff;
  --sly-cell-letter-outer:  #fff;
}

html.dark .theme-valoshka {
  --sly-cornflower:         #7a8fc8;
  --sly-cornflower-dark:    #5b6fa8;
  --sly-cornflower-light:   #9aaee0;
  --sly-cornflower-bg-subtle:    rgba(122, 143, 200, 0.12);
  --sly-cornflower-border-subtle: rgba(122, 143, 200, 0.25);
  --sly-cell-center:        #141e50;
  --sly-cell-outer:         #4a62a8;
  --sly-cell-center-hover:  #1c2a68;
  --sly-cell-outer-hover:   #5a72b8;
}
```

### 1.6 Migration: Legacy Aliases

To allow gradual migration, old variable names become aliases:

```css
:root {
  /* Legacy aliases — deprecated, will be removed */
  --color-accent: var(--sly-accent);
  --color-bg: var(--sly-bg);
  --color-bg-card: var(--sly-bg-card);
  --color-bg-surface: var(--sly-bg-surface);
  --color-text: var(--sly-text);
  --color-text-muted: var(--sly-text-muted);
  --color-border: var(--sly-border);
  --color-accent-subtle: var(--sly-accent-subtle);
  --color-accent-border: var(--sly-accent-border);
  --color-accent-light: var(--sly-accent-light);
  --color-accent-dark: var(--sly-accent-dark);
  --accent: var(--sly-accent);
  --bg: var(--sly-bg);
  --bg-card: var(--sly-bg-card);
  --bg-surface: var(--sly-bg-surface);
  --text: var(--sly-text);
  --text-muted: var(--sly-text-muted);
  --border: var(--sly-border);
  --card: var(--sly-bg-card);
  --font-display: var(--sly-font-display);
  --font-sans: var(--sly-font-sans);
}
```

These aliases ensure no visual change during migration. They'll be removed once all references use `--sly-*`.

---

## 2. Shared UI Components

All new components go in `src/shared/components/ui/`.

### 2.1 Modal

**Sources**: Pobach `Modal.tsx`, Valoshka `HowToPlay.tsx`, `RankingModal.tsx`, `YesterdayModal.tsx`

**Common pattern**: Fixed overlay + card + Escape close + body scroll lock

**API**:
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // default "480px"
}
```

### 2.2 StatCard

**Sources**: `stats/page.tsx` StatCard, Pobach stats `StatCard`, Valoshka `StatsPage` stat divs

**API**:
```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;  // highlight with accent color
}
```

### 2.3 PageHeader

**Sources**: Pobach `Header.tsx`, Valoshka `HeaderWithInspector.tsx`

**API**:
```tsx
interface PageHeaderProps {
  title: string;
  titleFont?: 'display' | 'sans';
  onHelpClick?: () => void;
  statsHref: string;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}
```

### 2.4 GameShell

**Sources**: Pobach page layout, Valoshka page layout

**API**:
```tsx
interface GameShellProps {
  themeClass?: string;
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // default '600px'
  backgroundStyle?: React.CSSProperties;
}
```

### 2.5 Toast

**Sources**: Pobach `ShareButton` tooltip, `BottomBanner` success message

**API**:
```tsx
interface ToastProps {
  message: string;
  visible: boolean;
  position?: 'top' | 'bottom';
  duration?: number;
}
```

### 2.6 PillButton

**Sources**: Pobach hint/give-up buttons, Valoshka action buttons, various CTA buttons

**API**:
```tsx
interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'ghost';
  size?: 'sm' | 'md';
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

### 2.7 Badge

**Sources**: `GameCard` "✓ Сёння" badge, Valoshka rank badge, Pobach day badge

**API**:
```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'neutral';
}
```

---

## 3. Shared Hooks & Patterns

### 3.1 useModal

```tsx
function useModal(): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ModalProps: { isOpen: boolean; onClose: () => void };
}
```

### 3.2 useShare

```tsx
function useShare(text: string): {
  share: () => Promise<void>;
  isSharing: boolean;
  showToast: boolean;
}
```

### 3.3 useCountdown

```tsx
function useCountdown(targetHour?: number): string
// Returns "HH:MM:SS" counting down to next UTC midnight by default
```

### 3.4 useAnimatedValue

```tsx
function useAnimatedValue(target: number, duration?: number): number
// Defaults: duration=900, easing=cubic-bezier-out
```

---

## 4. Styling Standardization

### 4.1 Rules

| Use Tailwind for | Use CSS variables for | Use inline style for |
|---|---|---|
| Layout (flex, grid, gap) | Colors (themed) | Runtime-computed values |
| Spacing (p-*, m-*) | Font families (themed) | Dynamic widths/heights |
| Typography size/weight | Border colors (themed) | Conditional styles from state |
| Borders, radii | Box shadows (themed) | SVG attributes |
| Responsive variants | Transitions (themed) | |

### 4.2 Example Migration

**Before** (Valoshka inline styles):
```tsx
<h2 style={{
  margin: 0,
  fontFamily: "var(--font-display)",
  fontSize: "26px",
  fontWeight: "700",
  color: "var(--text)",
  letterSpacing: "-0.02em",
}}>
```

**After** (Tailwind + tokens):
```tsx
<h2 className="font-display text-2xl font-bold tracking-tight text-[var(--sly-text)]">
```

---

## 5. File Structure

```
src/shared/
  tokens/
    index.css              ← All design tokens (primitives + semantics + aliases)
  components/
    ui/
      Modal.tsx
      StatCard.tsx
      PageHeader.tsx
      GameShell.tsx
      Toast.tsx
      PillButton.tsx
      Badge.tsx
      index.ts             ← Barrel export
    BannerContext.tsx       ← Keep existing
    BottomBanner.tsx        ← Keep, migrate to new tokens
    CookieBanner.tsx        ← Keep
    Footer.tsx              ← Keep, migrate to Tailwind
    GameCard.tsx            ← Keep, migrate to new tokens
    HeaderIconButtons.tsx   ← Keep
    HubNav.tsx              ← Keep, migrate
  hooks/
    useModal.ts
    useShare.ts
    useCountdown.ts
    useAnimatedValue.ts
    useHubState.ts          ← Keep existing
    useTheme.tsx            ← Keep existing
  lib/
    analytics.tsx            ← Keep existing
    storage.ts               ← Keep existing
  types/
    index.ts                 ← Keep, expand with UI types
```

---

## 6. Migration Plan

### Phase 1: Tokens (no visual change)
1. Create `src/shared/tokens/index.css` with all primitive, semantic, and component tokens
2. Add legacy aliases mapping `--color-X`/`--X` → `--sly-X`
3. Import tokens in `globals.css` before existing custom properties
4. Verify: no visual change, all existing references work via aliases

### Phase 2: Pobach Migration
1. Extract shared hooks (`useModal`, `useShare`, `useCountdown`)
2. Replace Pobach `Modal.tsx` with shared `<Modal>` + `useModal`
3. Convert Pobach inline styles to Tailwind + `--sly-*` tokens
4. Replace Pobach `CountdownTimer` with shared `useCountdown`
5. Replace Pobach footer with shared `<Footer>`
6. Verify: Pobach visual parity, no regressions

### Phase 3: Valoshka Migration
1. Replace Valoshka modal patterns (HowToPlay, RankingModal, YesterdayModal) with shared `<Modal>` + `useModal`
2. Convert Valoshka inline styles to Tailwind + `--sly-*` tokens
3. Replace Valoshka stat card with shared `<StatCard>`
4. Extract `useShare` from Valoshka ProgressBar
5. Verify: Valoshka visual parity, no regressions

### Phase 4: Shared Cleanup
1. Migrate all shared components (GameCard, Footer, HubNav, BottomBanner) to `--sly-*` tokens
2. Migrate hub page (`app/page.tsx`, `about`, `privacy`, `stats`) to `--sly-*` tokens
3. Remove deprecated aliases from globals.css
4. Run `biome check` + test suite

### Phase 5: Verification
1. Visual regression check per game (light + dark mode)
2. Lighthouse audit (accessibility, performance)
3. Verify all existing CI checks pass

---

## 7. Out of Scope

- **Font change** (Literata/Wix Madefor): Separate decision, tokens support any font pair
- **New game components** (SVG flower, progress bar with dots): Game-specific, stay in game folders
- **Game logic/hooks** (useGame, game reducer): Stays in game folders
- **Tailwind config customization**: Use Tailwind v4's CSS-first approach, tokens defined in CSS and referenced via `var()` in utilities
