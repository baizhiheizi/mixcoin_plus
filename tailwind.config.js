module.exports = {
  purge: ['./app/packs/src/apps/**/*.tsx', './app/views/**/*.html.erb'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
