/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0f2f8', 100: '#e1e5f1', 200: '#c3cbe3', 300: '#95a3cc',
          400: '#6474b0', 500: '#4356a0', 600: '#344088', 700: '#283270',
          800: '#1e2658', 900: '#141a3d', 950: '#0d1128',
        },
        wa: { light: '#dcf8c6', DEFAULT: '#25D366', dark: '#1da851' },
      },
    },
  },
  plugins: [],
}
