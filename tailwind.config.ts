import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#14304D',
        gold: '#D4A745',
        ink: '#1C1C1E',
        linen: '#F5F2ED',
        bone: '#FAF7F2',
        line: '#E6E1D8',
        muted: '#7A7A80',
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
