/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ais: {
          green: '#00E676',
          darkgreen: '#00A352',
          bg: '#0B1120',
          card: '#121A2F',
          cyan: '#00E5FF',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Noto Sans Thai', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.200'),
            a: {
              color: theme('colors.emerald.400'),
              '&:hover': {
                color: theme('colors.emerald.300'),
              },
            },
            h1: { color: theme('colors.slate.100') },
            h2: { color: theme('colors.slate.100') },
            h3: { color: theme('colors.slate.100') },
            h4: { color: theme('colors.slate.100') },
            strong: { color: theme('colors.emerald.300') },
            code: { color: theme('colors.emerald.200'), backgroundColor: theme('colors.slate.800'), padding: '2px 4px', borderRadius: '4px', fontWeight: '500' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: { backgroundColor: theme('colors.slate.900') },
            blockquote: { borderLeftColor: theme('colors.emerald.500'), color: theme('colors.slate.300') },
            hr: { borderColor: theme('colors.slate.700') },
            'ul > li::marker': { color: theme('colors.emerald.500') },
            'ol > li::marker': { color: theme('colors.emerald.500') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
