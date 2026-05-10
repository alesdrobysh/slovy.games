# Design System — Phase 1: Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `--sly-*` design token system as a single CSS file, import it in globals.css, and add legacy aliases so all existing code continues to work with zero visual change.

**Architecture:** A new `src/shared/tokens/index.css` file defines all primitive tokens (colors, spacing, typography, radii, shadows, transitions, fonts), semantic tokens (theme-aware backgrounds, text, borders, accents), and component tokens (game-specific). It is imported at the top of `globals.css` before existing custom properties. Legacy aliases map old `--color-X` and `--X` names to the new `--sly-X` names.

**Tech Stack:** CSS custom properties, Tailwind CSS v4 (CSS-first config), Next.js

---

## File Structure

```
src/shared/tokens/
  index.css          ← NEW: All design tokens (primitives + semantics + component tokens + aliases)

src/app/globals.css  ← MODIFY: Add @import for tokens, keep existing theme overrides
```

No other files change in Phase 1. The token file is purely additive — existing CSS custom properties remain untouched and work via aliases.

---

### Task 1: Create the tokens CSS file

**Files:**
- Create: `src/shared/tokens/index.css`

- [ ] **Step 1: Create the tokens directory**

```bash
mkdir -p src/shared/tokens
```

- [ ] **Step 2: Create the tokens CSS file with all primitive tokens**

Create `src/shared/tokens/index.css` with the full content below. This file defines:
1. `:root` — primitive tokens (raw values)
2. `:root` — semantic tokens (Hub/neutral light theme defaults)
3. `html.dark` — semantic tokens (dark theme overrides)
4. `.theme-pobach` / `html.dark .theme-pobach` — Pobach-specific overrides
5. `.theme-valoshka` / `html.dark .theme-valoshka` — Valoshka-specific overrides + component tokens
6. `:root` — legacy aliases (`--color-X` and `--X` → `--sly-X`)

```css
/* ================================================================
   Slovy Design Tokens
   Three-layer system: Primitive → Semantic → Component
   
   Naming convention: --sly-{category}-{variant}-{level}
   e.g., --sly-warm-500, --sly-blue-400, --sly-text-sm
   ================================================================ */

/* === Layer 1: Primitive Tokens (raw values, not theme-aware) === */
:root {
  /* --- Neutral / Warm palette --- */
  --sly-warm-50:  #f7f3ed;
  --sly-warm-100: #ede3d5;
  --sly-warm-200: #e2d5c5;
  --sly-warm-300: #d4c8ac;
  --sly-warm-600: #7a6848;
  --sly-warm-800: #6b5a51;
  --sly-warm-900: #2c1f0e;
  --sly-warm-950: #1b120e;

  /* --- Warm dark values (for dark mode overrides) --- */
  --sly-warm-dark-bg:         #0e0f1a;
  --sly-warm-dark-bg-card:    #161828;
  --sly-warm-dark-bg-surface: #1e2138;
  --sly-warm-dark-text:       #e8e4d8;
  --sly-warm-dark-text-muted: #7a7a9a;
  --sly-warm-dark-border:     #2a2d48;

  /* --- Blue accent (Valoshka / Hub) --- */
  --sly-blue-300: #9aaee0;
  --sly-blue-400: #8094c8;
  --sly-blue-500: #5b6fa8;
  --sly-blue-600: #3a4f80;

  /* --- Orange accent (Pobach) --- */
  --sly-orange-400: #f0a860;
  --sly-orange-500: #e58e3f;
  --sly-orange-600: #c07030;

  /* --- Orange dark values --- */
  --sly-orange-dark-bg:         #1a1410;
  --sly-orange-dark-bg-card:    #251e18;
  --sly-orange-dark-bg-surface: #2e241c;
  --sly-orange-dark-text:       #f0eae0;
  --sly-orange-dark-text-muted: #9a8a7e;
  --sly-orange-dark-border:     #3a3028;

  /* --- Green (Success / Rank) --- */
  --sly-green-400: #84cc16;
  --sly-green-500: #16a34a;

  /* --- Info blue --- */
  --sly-info-500: #4b83c8;

  /* --- Error red --- */
  --sly-red-500: #ef4444;

  /* --- Typography scale (1.25 ratio between steps) --- */
  --sly-text-xs:    0.75rem;    /* 12px */
  --sly-text-sm:    0.875rem;   /* 14px */
  --sly-text-base:  1rem;       /* 16px */
  --sly-text-lg:    1.125rem;   /* 18px */
  --sly-text-xl:    1.25rem;     /* 20px */
  --sly-text-2xl:   1.5rem;      /* 24px */
  --sly-text-3xl:   1.875rem;   /* 30px */
  --sly-text-4xl:   2.25rem;    /* 36px */
  --sly-text-5xl:   3rem;       /* 48px */

  /* --- Font weights --- */
  --sly-weight-normal: 400;
  --sly-weight-medium: 500;
  --sly-weight-semibold: 600;
  --sly-weight-bold: 700;

  /* --- Spacing (4pt scale) --- */
  --sly-space-1:  0.25rem;    /* 4px */
  --sly-space-2:  0.5rem;     /* 8px */
  --sly-space-3:  0.75rem;    /* 12px */
  --sly-space-4:  1rem;       /* 16px */
  --sly-space-5:  1.25rem;    /* 20px */
  --sly-space-6:  1.5rem;     /* 24px */
  --sly-space-8:  2rem;        /* 32px */
  --sly-space-10: 2.5rem;     /* 40px */
  --sly-space-12: 3rem;        /* 48px */
  --sly-space-16: 4rem;        /* 64px */
  --sly-space-20: 5rem;       /* 80px */
  --sly-space-24: 6rem;       /* 96px */

  /* --- Border radius --- */
  --sly-radius-sm:    6px;
  --sly-radius-md:    8px;
  --sly-radius-lg:   12px;
  --sly-radius-xl:   16px;
  --sly-radius-2xl:  24px;
  --sly-radius-full: 9999px;

  /* --- Shadows --- */
  --sly-shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
  --sly-shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --sly-shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --sly-shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* --- Transitions --- */
  --sly-duration-fast:   150ms;
  --sly-duration-normal: 250ms;
  --sly-duration-slow:   400ms;
  --sly-easing: cubic-bezier(0.4, 0, 0.2, 1);

  /* --- Fonts --- */
  --sly-font-display: "EB Garamond", serif;
  --sly-font-sans: "Manrope", sans-serif;
}

/* === Layer 2: Semantic Tokens (Hub / Neutral — light) === */
:root {
  --sly-bg:          var(--sly-warm-50);
  --sly-bg-card:     var(--sly-warm-100);
  --sly-bg-surface:  var(--sly-warm-200);
  --sly-text:        var(--sly-warm-900);
  --sly-text-muted:  var(--sly-warm-600);
  --sly-border:      var(--sly-warm-300);
  --sly-accent:           var(--sly-blue-500);
  --sly-accent-subtle:    rgba(91, 111, 168, 0.1);
  --sly-accent-border:    rgba(91, 111, 168, 0.22);
  --sly-accent-light:     var(--sly-blue-400);
  --sly-accent-dark:      var(--sly-blue-600);
}

/* === Layer 2: Semantic Tokens (Dark mode) === */
html.dark {
  --sly-bg:          var(--sly-warm-dark-bg);
  --sly-bg-card:     var(--sly-warm-dark-bg-card);
  --sly-bg-surface:  var(--sly-warm-dark-bg-surface);
  --sly-text:        var(--sly-warm-dark-text);
  --sly-text-muted:  var(--sly-warm-dark-text-muted);
  --sly-border:      var(--sly-warm-dark-border);
  --sly-accent:           #7a8fc8;
  --sly-accent-subtle:    rgba(122, 143, 200, 0.12);
  --sly-accent-border:    rgba(122, 143, 200, 0.25);
  --sly-accent-light:     #9aaee0;
  --sly-accent-dark:      #5b6fa8;
}

/* === Pobach Theme Overrides === */
.theme-pobach {
  --sly-pobach-orange: var(--sly-orange-500);
  --sly-pobach-bg:    #f7f3ed;
}
.theme-pobach {
  --sly-accent:     var(--sly-orange-500);
  --sly-accent-subtle:  rgba(229, 142, 63, 0.1);
  --sly-accent-border:   rgba(229, 142, 63, 0.22);
  --sly-accent-light:    var(--sly-orange-400);
  --sly-accent-dark:     var(--sly-orange-600);
}
html:not(.dark) .theme-pobach {
  --sly-bg:          #f7f3ed;
  --sly-bg-card:     #ede3d5;
  --sly-bg-surface:  #e2d5c5;
  --sly-text:        #1b120e;
  --sly-text-muted:  #6b5a51;
  --sly-border:      #e8e0d5;
}
html.dark .theme-pobach {
  --sly-bg:          var(--sly-orange-dark-bg);
  --sly-bg-card:     var(--sly-orange-dark-bg-card);
  --sly-bg-surface:  var(--sly-orange-dark-bg-surface);
  --sly-text:        var(--sly-orange-dark-text);
  --sly-text-muted:  var(--sly-orange-dark-text-muted);
  --sly-border:      var(--sly-orange-dark-border);
  --sly-accent:           var(--sly-orange-500);
  --sly-accent-subtle:    rgba(229, 142, 63, 0.12);
  --sly-accent-border:    rgba(229, 142, 63, 0.25);
  --sly-accent-light:     var(--sly-orange-400);
  --sly-accent-dark:      var(--sly-orange-600);
}

/* === Valoshka Theme Overrides === */
.theme-valoshka {
  --sly-valoshka-blue: var(--sly-blue-500);
  --sly-valoshka-paper: #f5f0e8;
  --sly-valoshka-dark-bg: #0e0f1a;
}
html:not(.dark) .theme-valoshka {
  --sly-bg:          #f5f0e8;
  --sly-bg-card:     #ede6d4;
  --sly-bg-surface:  #e2d8c4;
  --sly-text:        #2c1f0e;
  --sly-text-muted:  #7a6848;
  --sly-border:      #d4c8ac;
  --sly-accent:           var(--sly-blue-500);
  --sly-accent-subtle:    rgba(91, 111, 168, 0.1);
  --sly-accent-border:    rgba(91, 111, 168, 0.22);
  --sly-accent-light:     var(--sly-blue-400);
  --sly-accent-dark:      var(--sly-blue-600);
}
html.dark .theme-valoshka {
  --sly-bg:          #0e0f1a;
  --sly-bg-card:     #161828;
  --sly-bg-surface:  #1e2138;
  --sly-text:        #e8e4d8;
  --sly-text-muted:  #7a7a9a;
  --sly-border:      #2a2d48;
  --sly-accent:           #7a8fc8;
  --sly-accent-subtle:    rgba(122, 143, 200, 0.12);
  --sly-accent-border:    rgba(122, 143, 200, 0.25);
  --sly-accent-light:     #9aaee0;
  --sly-accent-dark:      #5b6fa8;
}

/* === Layer 3: Component Tokens === */

/* Pobach game tokens */
html:not(.dark) .theme-pobach {
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
  --sly-card-override:  #fff;
}
html.dark .theme-pobach {
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
  --sly-card-override:  var(--sly-bg-card);
}

/* Valoshka game tokens */
.theme-valoshka {
  --sly-cornflower:              var(--sly-blue-500);
  --sly-cornflower-dark:         var(--sly-blue-600);
  --sly-cornflower-light:        var(--sly-blue-400);
  --sly-cornflower-bg-subtle:    rgba(91, 111, 168, 0.1);
  --sly-cornflower-border-subtle: rgba(91, 111, 168, 0.22);
  --sly-cell-center:        #252850;
  --sly-cell-outer:         #7b9cf0;
  --sly-cell-center-hover:  #2a3670;
  --sly-cell-outer-hover:   #6a88e0;
  --sly-cell-letter-center: #fff;
  --sly-cell-letter-outer:  #fff;
}
html:not(.dark) .theme-valoshka {
  --sly-cornflower:              var(--sly-blue-500);
  --sly-cornflower-dark:         var(--sly-blue-600);
  --sly-cornflower-light:        var(--sly-blue-400);
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
  --sly-cornflower:              #7a8fc8;
  --sly-cornflower-dark:         #5b6fa8;
  --sly-cornflower-light:        #9aaee0;
  --sly-cornflower-bg-subtle:    rgba(122, 143, 200, 0.12);
  --sly-cornflower-border-subtle: rgba(122, 143, 200, 0.25);
  --sly-cell-center:        #141e50;
  --sly-cell-outer:         #4a62a8;
  --sly-cell-center-hover:  #1c2a68;
  --sly-cell-outer-hover:   #5a72b8;
  --sly-cell-letter-center: #fff;
  --sly-cell-letter-outer:  #fff;
}

/* === Legacy Aliases === */
/* Maps old --color-X and --X names to --sly-X equivalents.
   These allow existing code to continue working during migration.
   DEPRECATED — will be removed once all references use --sly-* names. */
:root {
  --color-neutral-accent: var(--sly-accent);
  --color-neutral-bg: var(--sly-bg);
  --color-neutral-bg-card: var(--sly-bg-card);
  --color-neutral-bg-surface: var(--sly-bg-surface);
  --color-neutral-text: var(--sly-text);
  --color-neutral-text-muted: var(--sly-text-muted);
  --color-neutral-border: var(--sly-border);

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

/* Pobach legacy aliases */
.theme-pobach {
  --pobach-orange: var(--sly-pobach-orange);
  --pobach-bg: var(--sly-pobach-bg);
  --pobach-dark-bg: var(--sly-orange-dark-bg);
  --rank-1: var(--sly-rank-1);
  --rank-10: var(--sly-rank-10);
  --rank-100: var(--sly-rank-100);
  --rank-1000: var(--sly-rank-1000);
  --rank-default: var(--sly-rank-default);
  --attempts-base: var(--sly-attempts-base);
  --attempts-1: var(--sly-attempts-1);
  --attempts-10: var(--sly-attempts-10);
  --attempts-50: var(--sly-attempts-50);
  --attempts-100: var(--sly-attempts-100);
  --attempts-many: var(--sly-attempts-many);
}
html.dark .theme-pobach {
  --rank-1: var(--sly-rank-1);
  --rank-10: var(--sly-rank-10);
  --rank-100: var(--sly-rank-100);
  --rank-1000: var(--sly-rank-1000);
  --rank-default: var(--sly-rank-default);
  --attempts-base: var(--sly-attempts-base);
  --attempts-1: var(--sly-attempts-1);
  --attempts-10: var(--sly-attempts-10);
  --attempts-50: var(--sly-attempts-50);
  --attempts-100: var(--sly-attempts-100);
  --attempts-many: var(--sly-attempts-many);
}

/* Valoshka legacy aliases */
.theme-valoshka {
  --valoshka-blue: var(--sly-valoshka-blue);
  --valoshka-paper: var(--sly-valoshka-paper);
  --valoshka-dark-bg: var(--sly-valoshka-dark-bg);
  --cornflower: var(--sly-cornflower);
  --cornflower-dark: var(--sly-cornflower-dark);
  --cornflower-light: var(--sly-cornflower-light);
  --cornflower-bg-subtle: var(--sly-cornflower-bg-subtle);
  --cornflower-border-subtle: var(--sly-cornflower-border-subtle);
  --cell-center: var(--sly-cell-center);
  --cell-outer: var(--sly-cell-outer);
  --cell-center-hover: var(--sly-cell-center-hover);
  --cell-outer-hover: var(--sly-cell-outer-hover);
  --cell-letter-center: var(--sly-cell-letter-center);
  --cell-letter-outer: var(--sly-cell-letter-outer);
}
html.dark .theme-valoshka {
  --cornflower: var(--sly-cornflower);
  --cornflower-dark: var(--sly-cornflower-dark);
  --cornflower-light: var(--sly-cornflower-light);
  --cornflower-bg-subtle: var(--sly-cornflower-bg-subtle);
  --cornflower-border-subtle: var(--sly-cornflower-border-subtle);
  --cell-center: var(--sly-cell-center);
  --cell-outer: var(--sly-cell-outer);
  --cell-center-hover: var(--sly-cell-center-hover);
  --cell-outer-hover: var(--sly-cell-outer-hover);
  --cell-letter-center: var(--sly-cell-letter-center);
  --cell-letter-outer: var(--sly-cell-outer);
}
```

- [ ] **Step 3: Verify the file was created correctly**

Run: `wc -l src/shared/tokens/index.css`
Expected: ~200+ lines

---

### Task 2: Import tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the tokens import at the top of globals.css**

At the very top of `src/app/globals.css`, before the existing `@import "tailwindcss";`, add:

```css
@import "../shared/tokens/index.css";
```

The top of globals.css should now look like:

```css
@import "../shared/tokens/index.css";
@import "tailwindcss";
```

- [ ] **Step 2: Verify the app still builds and renders correctly**

Run: `npm run build`
Expected: Build succeeds with no errors.

Run: `npm run dev` and visually check the hub page, Pobach, and Valoshka in both light and dark mode.
Expected: Zero visual change — all existing color variables still work via the legacy aliases.

---

### Task 3: Verify legacy alias correctness

**Files:**
- No new files — verification only

- [ ] **Step 1: Search for all CSS variable references in the codebase**

Run: `rg 'var\(--(?!sly)' src/ --type css --type tsx --type ts -c`
This counts all non-`--sly` CSS variable references that should be covered by aliases.

Expected: Many hits (this is expected — all legacy names still in code). The key verification is that each referenced name has a corresponding alias in `src/shared/tokens/index.css`.

- [ ] **Step 2: Check for any referenced variable that lacks an alias**

Run these commands and verify each name exists in the aliases section:

```bash
rg 'var\(--pobach-orange\b' src/ | head -5
rg 'var\(--pobach-bg\b' src/ | head -5
rg 'var\(--valoshka-blue\b' src/ | head -5
rg 'var\(--cornflower(?!-)' src/ | head -5
rg 'var\(--rank-' src/ | head -5
rg 'var\(--attempts-' src/ | head -5
rg 'var\(--cell-' src/ | head -5
rg 'var\(--hint-bg' src/ | head -5
```

If any variable is referenced but missing from the alias list, add it to `src/shared/tokens/index.css`.

Note: `--hint-bg` is a Valoshka-specific variable. Check if it's defined in globals.css or inline. If inline, it may not need an alias (it's set in component code). Verify this case manually.

- [ ] **Step 3: Run the linter**

Run: `npm run lint`
Expected: No new errors.

- [ ] **Step 4: Run existing tests**

Run: `npm test`
Expected: All existing tests pass (they shouldn't be affected by CSS changes).

- [ ] **Step 5: Commit**

```bash
git add src/shared/tokens/index.css src/app/globals.css
git commit -m "feat: add design token system (--sly-*) with legacy aliases

- Create src/shared/tokens/index.css with three-layer token hierarchy
- Primitives: colors, spacing, typography, radii, shadows, transitions, fonts
- Semantics: theme-aware bg/text/border/accent tokens
- Components: game-specific tokens (rank, attempts, cornflower, cell)
- Legacy aliases: --color-X and --X map to --sly-X equivalents
- Import tokens in globals.css before tailwindcss
- Zero visual change — all existing code works via aliases"
```
