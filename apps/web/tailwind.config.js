/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // GoalRush Brand Palette — Pitch Green
        brand: {
          black:  '#091410',
          dark:   '#0f1f16',
          card:   '#142a1c',
          border: '#1a3322',
          muted:  '#2a5235',
          red:    '#22c55e',       // accent color (class name kept for zero breaking changes)
          'red-hover': '#16a34a',
          'red-light': '#86efac',
          gold:   '#f4a261',
          'gold-light': '#f7c59f',
          white:  '#e8f5ec',
          gray:   '#94a3b8',
        },
        live: '#10b981',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas-neue)', 'Impact', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        'ticker':       'ticker 40s linear infinite',
        'pulse-red':    'pulse-red 2s ease-in-out infinite',
        'slide-up':     'slide-up 0.4s ease-out',
        'fade-in':      'fade-in 0.3s ease-out',
        'score-flash':  'score-flash 0.6s ease-in-out',
        'live-dot':     'live-dot 1.5s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'score-flash': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%':      { backgroundColor: 'rgba(212, 175, 55, 0.3)' },
        },
        'live-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.8)' },
        },
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #091410 0%, #0f1f16 50%, #091410 100%)',
        'card-gradient':    'linear-gradient(180deg, #142a1c 0%, #0f1f16 100%)',
        'red-gradient':     'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gold-gradient':    'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
        'shimmer':          'linear-gradient(90deg, #142a1c 25%, #1a3322 50%, #142a1c 75%)',
      },
    },
  },
  plugins: [],
};
