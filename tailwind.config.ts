import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /*
         * Brand blue — primary is #1458BA (exact logo colour).
         * Dark variants for hero/section backgrounds.
         */
        navy: {
          50:  '#eef4fd',
          100: '#d4e4f8',
          200: '#a9caf2',
          300: '#74a5e8',
          400: '#4882dc',
          500: '#1d6bcb',
          600: '#1458ba',  // ← PRIMARY LOGO BLUE
          700: '#1149a0',
          800: '#0d3a84',
          900: '#0a2d6e',  // dark sections / header scrolled
          950: '#071d52',  // deepest hero background
        },
        /*
         * Sky blue — Accent 1, primary UI accent (#28C8FF family).
         * Used for buttons, labels, dividers, badges, highlights.
         */
        sky: {
          50:  '#e6faff',
          100: '#c0f3ff',
          200: '#8cecff',
          300: '#4ddfff',
          400: '#28c8ff',  // ← PRIMARY UI ACCENT
          500: '#00aee6',
          600: '#0090bf',
          700: '#006e92',
          800: '#004f69',
          900: '#003345',
        },
        /*
         * Gold — Accent 2, premium/award moments only.
         * Reserved for trophy icons, award imagery, black-tie references.
         */
        gold: {
          50:  '#fdf8ed',
          100: '#faeecf',
          200: '#f4d99e',
          300: '#ebbe6a',
          400: '#e0a13b',
          500: '#c9a84c',  // premium award gold
          600: '#ad8a30',
          700: '#8d6e26',
          800: '#71581f',
          900: '#5c471a',
        },
        /*
         * Neutral dark grey — Support colour.
         */
        charcoal: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans:    ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
