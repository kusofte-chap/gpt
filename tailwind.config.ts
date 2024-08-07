import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,svg}",
  ],
  theme: {
    extend: {
      colors: {
        'token-text-primary': 'rgba(13, 13, 13, 0.68)',
        'token-text-secondary': '#9d9d9d',
        'token-text-tertiary': '#b4b4b4',
        'token-sidebar-surface-primary': '#f9f9f9',
        'token-sidebar-surface-secondary': '#ececec',
        'token-main-surface-tertiary': '#ececec',
        'token-border-light': 'rgba(0, 0, 0, 0.1)',
        'token-main-surface-primary': '#fff',
        'token-text-error': '#b91c1c',
        'token-main-surface-secondary':'#f9f9f9',
        'token-border-medium':'rgba(0, 0, 0, 0.15)',
        'token-border-xheavy':'rgba(0, 0, 0, 0.25)',
      },
      boxShadow: {
        '3xl': 'inset 0 0 0 150px #0000001a',
        '3xl-btr': '0 1px 0 rgba(0, 0, 0, 0.1)',
        'ok-btn':'inset 0 0 0 150px #0000001a'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
export default config;
