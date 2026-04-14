import type { Config } from 'tailwindcss'

/**
 * Mission Business 2026 — Tailwind theme
 *
 * Core palette:
 *   - Black / very dark backgrounds
 *   - Bright green accent (the Mission Business logo green)
 *   - Neutral surface tones for cards, borders, dividers
 *
 * Edit the values below to fine-tune brand colours without touching components.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mission Business bright green — primary accent
        mb: {
          50:  '#e9ffef',
          100: '#ccffd9',
          200: '#99ffb5',
          300: '#5bff8c',
          400: '#27f068',   // hover / lighter accent
          500: '#12de56',   // ← PRIMARY ACCENT
          600: '#09b845',
          700: '#088f37',
          800: '#0a6d2d',
          900: '#0a5a27',
        },
        // Neutral dark surfaces
        ink: {
          950: '#050505',   // page background (near-black)
          900: '#0b0b0c',   // section background
          850: '#111113',   // elevated surface
          800: '#17181b',   // card background
          700: '#1f2024',   // hover card background
          600: '#2a2c31',   // strong border
          500: '#3a3d43',   // muted text
          400: '#6b6f78',
          300: '#a6aab1',
          200: '#d3d5d9',
          100: '#ececee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
