/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'hsl(var(--brand-primary))',
          'primary-fg': 'hsl(var(--brand-primary-fg))',
          bg: 'hsl(var(--brand-bg))',
          surface: 'hsl(var(--brand-surface))',
          'surface-alt': 'hsl(var(--brand-surface-alt))',
          border: 'hsl(var(--brand-border))',
          'text-primary': 'hsl(var(--brand-text-primary))',
          'text-secondary': 'hsl(var(--brand-text-secondary))',
          'text-tertiary': 'hsl(var(--brand-text-tertiary))',
          danger: 'hsl(var(--brand-danger))',
          accent: 'hsl(var(--brand-accent))',
          success: 'hsl(var(--brand-success))',
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'sans-serif'],
        display: ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}