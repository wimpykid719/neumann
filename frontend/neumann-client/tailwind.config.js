/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
        },
      },
      boxShadow: {
        pagination: '0 2px 6px 0 rgb(var(--color-primary) / 0.6)',
      },
    },
  },
  safelist: [
    {
      pattern: /(text|bg|border)-(primary|secondary|success|danger|warning)/,
    },
  ],
  plugins: [],
}
