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
        // GoalRush Brand Palette — Premium Dark Blue
        brand: {
          black:  '#0a0f1e',
          dark:   '#0f1729',
          card:   '#162038',
          border: '#1e2d4a',
          muted:  '#2d4a7a',
          red:    '#3b82f6',       // accent color (class name kept for zero breaking changes)
          'red-hover': '#2563eb',
          'red-light': '#93c5fd',
          gold:   '#f59e0b',
          'gold-light': '#fcd34d',
          white:  '#e8f0fe',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
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
        'hero-gradient':    'linear-gradient(135deg, #0a0f1e 0%, #0f1729 50%, #0a0f1e 100%)',
        'card-gradient':    'linear-gradient(180deg, #162038 0%, #0f1729 100%)',
        'red-gradient':     'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gold-gradient':    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'shimmer':          'linear-gradient(90deg, #162038 25%, #1e2d4a 50%, #162038 75%)',
      },
    },
  },
  plugins: [],
};
