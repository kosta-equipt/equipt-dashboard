import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#14304D',
        'midnight-soft': '#2A5788',
        gold: '#D4A745',
        ink: '#1C1C1E',
        'ink-dark': '#0B0B0C',
        linen: '#F5F2ED',
        'linen-dark': '#1A1A1C',
        bone: '#FAF7F2',
        'bone-dark': '#0F0F11',
        line: '#E6E1D8',
        'line-dark': '#26262A',
        muted: '#7A7A80',
        'muted-dark': '#8A8A92',
      },
      fontFamily: {
        sans: ['Gotham', 'Arial', 'system-ui', 'sans-serif'],
        display: ['Gotham', 'Arial', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.08em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 48, 77, 0.04), 0 2px 8px rgba(20, 48, 77, 0.03)',
      },
    },
  },
  plugins: [],
}

export default config
