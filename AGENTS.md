## Design System Rules
- NEVER use inline style overrides or className overrides on Typography components. If a variant doesn't exist, add it to Typography itself.
- ALWAYS use design tokens (spacing, color, typography) instead of raw values like `mt-0.5`, hex colors, or pixel sizes.
- When refactoring components, use existing tokens/variants — do not introduce component-specific Typography variants (e.g., `statLabel`, `statValue`).
Add as a ## Workflow Rules section. Place above any tool/skill guidance.\n\n## Workflow Rules
- For concrete refactors or 'add a Storybook story for X' tasks, act directly — do NOT invoke brainstorming skills or do extended codebase exploration first.
- Match Storybook stories to ACTUAL app usage. Start with 1–2 stories reflecting real props; do not pre-emptively add 5+ variants.
- When a Storybook story needs context providers (ThemeProvider, etc.), add a decorator from the start.

## Debugging Rules
- When fixing build/import/CSS errors, identify the ROOT CAUSE before attempting workarounds. Check config files (next.config.ts, tailwind, tsconfig) first.
- Don't propose alias changes or removing imports as a first fix.