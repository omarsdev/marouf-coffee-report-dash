module.exports = {
  darkMode: 'class',
  purge: {
    content: ['./src/**/*.tsx'],
    options: {
      safelist: ['dark'],
    },
  },
  theme: {
    typography: (theme) => ({}),
    extend: {
      colors: {
        primary: {
          500: '#3DBEC9',
        },
        gray: {
          500: '#f7f8fa',
        },
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: 'white',
          },
        },
      }),
    },
  },
  variants: {
    typography: ['dark'],
  },
  plugins: [require('@tailwindcss/typography')],
}
