import type { CSSProperties, ElementType, ReactNode } from 'react';

export type TypographyVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'overline'
  | 'body'
  | 'caption';

interface VariantConfig {
  style: CSSProperties;
  tag: ElementType;
}

const D = 'var(--font-d)';
const B = 'var(--font-b)';

const VARIANTS: Record<TypographyVariant, VariantConfig> = {
  display: {
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
  title: {
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
  heading: {
    tag: 'h3',
    style: {
      fontFamily: D,
      fontWeight: 500,
      fontSize: '24px',
      lineHeight: 1,
      margin: 0,
    },
  },
  overline: {
    tag: 'span',
    style: {
      fontFamily: B,
      fontWeight: 500,
      fontSize: '10px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      margin: 0,
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
  [key: string]: unknown;
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
  ...rest
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
    <Tag style={combinedStyle} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
