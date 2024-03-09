/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary, #CBF7ED)',
        secondary: 'var(--secondary, #FFA69E)',
        accent: 'var(--accent, #E4FDE1)',
        tertiary: 'var(--tertiary, #FF686B)',
        dark: 'var(--dark, #394053)',
        light: 'var(--light, #E8F0F2)',
        charcol: 'var(--charcol, #394053)',
        // white: 'var(--white, #fff)',
      },
    },
  },
  plugins: [],
}
