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
        // GoalRush Brand Palette — Premier Blue
        brand: {
          black:  '#05101f',
          dark:   '#0a1929',
          card:   '#0f2240',
          border: '#1e3a5f',
          muted:  '#3a5580',
          red:    '#3b82f6',
          'red-hover': '#1d4ed8',
          'red-light': '#93c5fd',
          gold:   '#f4a261',
          'gold-light': '#f7c59f',
          white:  '#e8f0ff',
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
        'hero-gradient':    'linear-gradient(135deg, #05101f 0%, #0a1929 50%, #05101f 100%)',
        'card-gradient':    'linear-gradient(180deg, #0f2240 0%, #0a1929 100%)',
        'red-gradient':     'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gold-gradient':    'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
        'shimmer':          'linear-gradient(90deg, #0f2240 25%, #1e3a5f 50%, #0f2240 75%)',
      },
    },
  },
  plugins: [],
};
