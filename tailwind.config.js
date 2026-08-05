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
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
