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
         * Brand blue family — primary is #1558ba (exact logo colour).
         * Dark variants used for hero/section backgrounds.
         * Light variants used for tints and hover states.
         */
        navy: {
          50:  '#eef4fd',
          100: '#d4e4f8',
          200: '#a9caf2',
          300: '#74a5e8',
          400: '#4882dc',
          500: '#1d6bcb',
          600: '#1558ba',  // ← primary logo blue
          700: '#1149a0',
          800: '#0d3a84',
          900: '#0a2d6e',  // dark sections / header scrolled
          950: '#071d52',  // deepest hero background
        },
        gold: {
          50:  '#fdf8ed',
          100: '#faeecf',
          200: '#f4d99e',
          300: '#ebbe6a',
          400: '#e0a13b',
          500: '#c9a84c',  // primary awards gold
          600: '#ad8a30',
          700: '#8d6e26',
          800: '#71581f',
          900: '#5c471a',
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
