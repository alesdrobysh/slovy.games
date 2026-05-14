import type { CSSProperties, ElementType, ReactNode } from 'react';

export type TypographyVariant =
  | 'hero'
  | 'gameTitle'
  | 'winWord'
  | 'navWordmark'
  | 'body'
  | 'caption';

interface VariantConfig {
  style: CSSProperties;
  tag: ElementType;
}

const D = 'var(--font-d)';
const B = 'var(--font-b)';

const VARIANTS: Record<TypographyVariant, VariantConfig> = {
  hero: {
    tag: 'h1',
    style: {
      fontFamily: D,
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 'clamp(80px, 16vw, 140px)',
      lineHeight: 0.9,
      letterSpacing: '-0.03em',
      margin: 0,
    },
  },
  gameTitle: {
    tag: 'h2',
    style: {
      fontFamily: D,
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 'clamp(32px, 5vw, 42px)',
      lineHeight: 0.9,
      letterSpacing: '-0.03em',
      margin: 0,
    },
  },
  winWord: {
    tag: 'p',
    style: {
      fontFamily: D,
      fontStyle: 'italic',
      fontWeight: 350,
      fontSize: '56px',
      lineHeight: 1.0,
      letterSpacing: '-0.04em',
      margin: 0,
    },
  },
  navWordmark: {
    tag: 'span',
    style: {
      fontFamily: D,
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: 1,
      letterSpacing: '-0.02em',
    },
  },
  body: {
    tag: 'p',
    style: {
      fontFamily: B,
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14.5px',
      lineHeight: 1.65,
      textAlign: 'justify',
      hyphens: 'auto',
      // hangingPunctuation not in React.CSSProperties but valid CSS
      margin: 0,
    },
  },
  caption: {
    tag: 'p',
    style: {
      fontFamily: B,
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1.65,
      margin: 0,
    },
  },
};

export interface TypographyProps {
  variant: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  dropCap?: boolean;
  game?: 'pobach' | 'valoshka';
  oldstyleNums?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Typography({
  variant,
  as,
  children,
  dropCap = false,
  game,
  oldstyleNums = false,
  className,
  style,
}: TypographyProps) {
  const config = VARIANTS[variant];
  const Tag = as ?? config.tag;

  const combinedStyle: CSSProperties = {
    ...config.style,
    ...(oldstyleNums && { fontVariantNumeric: 'oldstyle-nums' }),
    ...style,
  };

  const classes = [
    dropCap && 'typo-drop-cap',
    dropCap && game && `game-${game}`,
    className,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <Tag style={combinedStyle} className={classes}>
      {children}
    </Tag>
  );
}
