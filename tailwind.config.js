module.exports = {
  purge: ['./app/packs/apps/**/*.tsx', './app/views/**/*.html.erb'],
  darkMode: 'class',
  theme: {
    minHeight: {
      1: '0.25rem',
      2: '0.5rem',
      4: '1rem',
      8: '2rem',
      16: '4rem',
      32: '8rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      screen: '100vh',
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      dark: '#1b1c1e',
    }),
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
