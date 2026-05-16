import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography } from '@/shared/components/ui/Typography';
import type { TypographyVariant } from '@/shared/components/ui/Typography';

const meta = {
  title: 'Design/Typography',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// ─── Scale specimen ──────────────────────────────────────────────

interface ScaleRow {
  variant: TypographyVariant;
  label: string;
  spec: string;
  sample: string;
}

const SCALE: ScaleRow[] = [
  {
    variant: 'titleHero',
    label: 'titleHero',
    spec: 'Literata 500 · clamp(40–72px) · lh 0.9 · ls −0.03em',
    sample: 'Словы',
  },
  {
    variant: 'title',
    label: 'title',
    spec: 'Literata italic 500 · clamp(32–42px) · lh 0.9 · ls −0.03em',
    sample: 'Валошка',
  },
  {
    variant: 'heading',
    label: 'heading',
    spec: 'Literata 500 · 24px · lh 1',
    sample: 'Сонейка',
  },
  {
    variant: 'overline',
    label: 'overline',
    spec: 'Wix Madefor Text 500 · 10px · ls 0.2em · uppercase',
    sample: 'Словы вывучаны',
  },
  {
    variant: 'body',
    label: 'body',
    spec: 'Wix Madefor Text 400 · 14.5px · lh 1.65 · justify + hyphens',
    sample:
      "Штодня з'яўляецца новае слова — адгадай яго праз семантычна блізкія словы. Кожнае слова, якое ты ўводзіш, паказвае, наколькі яно блізкае да мэты.",
  },
  {
    variant: 'caption',
    label: 'caption',
    spec: 'Wix Madefor Text italic 400 · 14px · lh 1.65',
    sample: 'Словы адсартаваны па частаце ўжывання ў сучаснай беларускай мове.',
  },
  {
    variant: 'smallSerif',
    label: 'smallSerif',
    spec: 'Literata 500 · 14px · lh 1',
    sample: 'В _ Р _ Б _ Й',
  },
  {
    variant: 'gameInput',
    label: 'gameInput',
    spec: 'Literata 500 · 40px · lh 1 · ls 0.01em',
    sample: 'ВАРАБ',
  },
];

function SpecRow({ variant, label, spec, sample }: ScaleRow) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '0 24px',
        alignItems: 'start',
        padding: '24px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ paddingTop: 2 }}>
        <code
          style={{
            display: 'block',
            fontSize: 10,
            fontFamily: 'monospace',
            color: 'var(--muted)',
            letterSpacing: '0.04em',
            marginBottom: 4,
          }}
        >
          .{label}
        </code>
        <p
          style={{
            fontSize: 10,
            color: 'var(--muted)',
            lineHeight: 1.5,
            margin: 0,
            fontFamily: 'var(--font-b)',
          }}
        >
          {spec}
        </p>
      </div>
      <div style={{ color: 'var(--fg)' }}>
        <Typography variant={variant}>{sample}</Typography>
      </div>
    </div>
  );
}

function ScaleSpecimen() {
  return (
    <div
      style={{
        padding: 40,
        background: 'var(--bg)',
        minHeight: '100vh',
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--muted)',
          marginBottom: 0,
          fontFamily: 'var(--font-b)',
        }}
      >
        Type Scale
      </p>
      {SCALE.map((row) => (
        <SpecRow key={row.variant} {...row} />
      ))}
    </div>
  );
}

export const Scale: Story = {
  render: () => <ScaleSpecimen />,
};

// ─── Drop cap specimen ───────────────────────────────────────────

const DROP_CAP_BODY =
  "Штодня з'яўляецца новае слова — адгадай яго праз семантычна блізкія словы. " +
  "Кожнае слова, якое ты ўводзіш, паказвае, наколькі яно блізкае да мэты. " +
  "Чым бліжэй да першага месца, тым больш падобнае слова па значэнні.";

interface DropCapCardProps {
  game: 'pobach' | 'valoshka';
  title: string;
  accent: string;
}

function DropCapCard({ game, title, accent }: DropCapCardProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 28,
        maxWidth: 360,
      }}
    >
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-b)',
          fontSize: 11,
          fontVariantCaps: 'small-caps',
          letterSpacing: '0.13em',
          color: accent,
          marginBottom: 10,
        }}
      >
        {game === 'pobach' ? 'Семантычная' : 'Слоўная'}
      </span>
      <Typography
        variant="title"
        style={{ color: 'var(--fg)', display: 'block', marginBottom: 16 }}
      >
        {title}
      </Typography>
      <Typography variant="body" dropCap game={game} style={{ color: 'var(--fg-2)' }}>
        {DROP_CAP_BODY}
      </Typography>
    </div>
  );
}

function DropCapSpecimen() {
  return (
    <div
      style={{
        padding: 40,
        background: 'var(--bg)',
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <DropCapCard game="pobach" title="Побач" accent="var(--pobach)" />
      <DropCapCard game="valoshka" title="Валошка" accent="var(--valoshka)" />
    </div>
  );
}

export const DropCap: Story = {
  render: () => <DropCapSpecimen />,
};

// ─── Oldstyle numerals ───────────────────────────────────────────

function OldstyleSpecimen() {
  return (
    <div
      style={{
        padding: 40,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted)',
            marginBottom: 12,
            fontFamily: 'var(--font-b)',
          }}
        >
          Lining (default)
        </p>
        <Typography variant="titleHero" style={{ color: 'var(--fg)', fontSize: '56px' }}>
          1 2 3 4 5 6 7 8 9 0
        </Typography>
      </div>
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted)',
            marginBottom: 12,
            fontFamily: 'var(--font-b)',
          }}
        >
          Oldstyle (scores &amp; status)
        </p>
        <Typography variant="titleHero" oldstyleNums style={{ color: 'var(--fg)', fontSize: '56px' }}>
          1 2 3 4 5 6 7 8 9 0
        </Typography>
      </div>
    </div>
  );
}

export const OldstyleNumerals: Story = {
  render: () => <OldstyleSpecimen />,
};
