import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta = {
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {
  args: { children: 'Штодзённая', variant: 'accent' },
};

export const Success: Story = {
  args: { children: 'Выканана', variant: 'success' },
};

export const Neutral: Story = {
  args: { children: 'Архіў', variant: 'neutral' },
};
