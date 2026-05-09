/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          red:       '#C0392B',
          'red-light': '#E74C3C',
          cream:     '#F5F0EB',
        },
        rack: {
          DEFAULT: '#141414',
          card:    '#1C1C1C',
          border:  'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
