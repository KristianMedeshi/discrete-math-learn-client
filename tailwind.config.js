/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      mobile: '375px',
      tablet: '768px',
      desktop: '1024px',
    },
    colors: {
      primary: 'var(--color-theme-primary)',
      secondary: 'var(--color-theme-secondary)',
      purple: 'var(--color-purple)',
      lightPurple: 'var(--color-light-purple)',
      lines: 'var(--color-theme-lines)',
      red: 'var(--color-red)',
    },
  },
  plugins: [],
};
