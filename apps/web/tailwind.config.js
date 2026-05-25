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
        // GoalRush Brand Palette
        brand: {
          black:  '#0a0a0a',
          dark:   '#111111',
          card:   '#1a1a1a',
          border: '#2a2a2a',
          muted:  '#3a3a3a',
          red:    '#dc2626',
          'red-hover': '#b91c1c',
          'red-light': '#ef4444',
          gold:   '#d4af37',
          'gold-light': '#f0cf6a',
          white:  '#ffffff',
          gray:   '#a1a1aa',
        },
        live: '#16a34a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(220, 38, 38, 0)' },
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
        'hero-gradient':    'linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)',
        'card-gradient':    'linear-gradient(180deg, #1a1a1a 0%, #111111 100%)',
        'red-gradient':     'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        'gold-gradient':    'linear-gradient(135deg, #d4af37 0%, #a87e1a 100%)',
        'shimmer':          'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
      },
    },
  },
  plugins: [],
};
