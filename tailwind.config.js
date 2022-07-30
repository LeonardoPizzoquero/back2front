/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          500: '#f35c61',
        },
        orange: {
          500: '#f0522b',
        },
        green: {
          500: '#51da9f',
        },
        purple: {
          500: '#7477ce',
        },
        gray: {
          800: '#242426',
          900: '#1c1c1e',
        },
      },
    },
  },
  plugins: [],
};
