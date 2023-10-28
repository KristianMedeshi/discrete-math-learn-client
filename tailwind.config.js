/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      primary: 'var(--color-theme-primary)',
      secondary: 'var(--color-theme-secondary)',
      purple: 'var(--color-purple)',
      lightPurple: 'var(--color-light-purple)',
      lines: 'var(--color-lines)',
      red: 'var(--color-red)',
    },
  },
  plugins: [],
};
