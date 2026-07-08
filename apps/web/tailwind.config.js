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
        // GoalRush Brand Palette — friendly navy-slate
        brand: {
          black:  '#0f1923',
          dark:   '#16212e',
          card:   '#1e2d3d',
          border: '#2d4258',
          muted:  '#4a6070',
          red:    '#e63946',
          'red-hover': '#c1121f',
          'red-light': '#ff6b6b',
          gold:   '#f4a261',
          'gold-light': '#f7c59f',
          white:  '#f0f4f8',
          gray:   '#94a3b8',
        },
        live: '#10b981',
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
        'hero-gradient':    'linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)',
        'card-gradient':    'linear-gradient(180deg, #1e2d3d 0%, #16212e 100%)',
        'red-gradient':     'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
        'gold-gradient':    'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
        'shimmer':          'linear-gradient(90deg, #1e2d3d 25%, #2d4258 50%, #1e2d3d 75%)',
      },
    },
  },
  plugins: [],
};
