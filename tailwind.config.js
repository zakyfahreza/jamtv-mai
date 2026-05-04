/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F0D060',
          dark: '#A08020',
          muted: '#C9A84C',
        },
        // ── Green Sakinah Theme ──
        sk: {
          bg:        '#0B1E17',  // very dark green background
          surface:   '#112519',  // slightly lighter surface
          card:      '#183322',  // card bg
          border:    '#254D35',  // border
          primary:   '#3A7D5B',  // medium green
          secondary: '#52B788',  // accent green
          light:     '#95D5B2',  // soft mint
          text:      '#E8F5EE',  // near-white with green tint
          muted:     '#6AAF8A',  // muted green text
          dark:      '#071410',  // darkest layer
        },
      },
      fontFamily: {
        digital: ['"Open Sans"', 'sans-serif'],
        arabic:  ['"Noto Naskh Arabic"', 'serif'],
        display: ['"Open Sans"', 'sans-serif'],
        body:    ['"Open Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in':         'fadeIn 0.8s ease-in-out',
        'fade-out':        'fadeOut 0.8s ease-in-out',
        'pulse-gold':      'pulseGold 2s ease-in-out infinite',
        'glow':            'glow 2s ease-in-out infinite alternate',
        'slide-in':        'slideIn 0.5s ease-out',
        'countdown-pulse': 'countdownPulse 1s ease-in-out infinite',
        'breathe':         'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut: { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        pulseGold: {
          '0%, 100%': { color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.5)' },
          '50%':       { color: '#F0D060', textShadow: '0 0 50px rgba(240,208,96,0.9)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 10px rgba(212,175,55,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.3)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        countdownPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':       { transform: 'scale(1.02)', opacity: '0.9' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.85' },
          '50%':       { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
