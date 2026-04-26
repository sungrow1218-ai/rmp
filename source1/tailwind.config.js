import { join } from 'node:path';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [join(__dirname, './src/**/*.{jsx,tsx,js,ts,vue,html,njk}')],
  theme: {
    extend: {},
  },
  plugins: [],
};
