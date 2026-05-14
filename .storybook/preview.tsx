import type { Preview } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
// @ts-expect-error css side-effect import
import '../src/app/globals.css';

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const isDark = context.globals['theme'] === 'dark';
      useEffect(() => {
        document.documentElement.dataset.theme = isDark ? 'dark' : '';
      }, [isDark]);
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;