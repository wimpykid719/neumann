/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#ffe5e7',
          200: '#ffb3b7',
          300: '#ff8088',
          400: '#ff4d58',
          500: '#ff0211',
        },
        secondary: {
          500: '#4DC9FF',
          600: '#45b4e5',
        },
        success: {
          500: '#09BAB5',
        },
        danger: {
          500: '#ff0211',
        },
        warning: {
          500: '#FFB035',
        },
      },
    },
  },
  plugins: [],
}
