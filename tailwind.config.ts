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
        navy: {
          50:  '#eef1f8',
          100: '#d5dced',
          200: '#aab8da',
          300: '#7e94c7',
          400: '#5c78b8',
          500: '#3f5fa4',
          600: '#2f4d8c',
          700: '#223971',
          800: '#162558',
          900: '#0d1b3e',
          950: '#060e22',
        },
        gold: {
          50:  '#fdf8ed',
          100: '#f9eece',
          200: '#f3d99e',
          300: '#ebbe6a',
          400: '#e0a13b',
          500: '#c9a84c',
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
      backgroundImage: {
        'hero-dots': 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.18) 1px, transparent 0)',
      },
      backgroundSize: {
        'dots-lg': '36px 36px',
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
