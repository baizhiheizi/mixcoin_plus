module.exports = {
  purge: ['./app/packs/apps/**/*.tsx', './app/views/**/*.html.erb'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
