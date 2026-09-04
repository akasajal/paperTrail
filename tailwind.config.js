/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--background)',
          surface: 'var(--surface)',
          variant: 'var(--surface-variant)',
          primary: 'var(--primary)',
          'primary-container': 'var(--primary-container)',
          secondary: 'var(--secondary)',
          'secondary-container': 'var(--secondary-container)',
          text: 'var(--text)',
          muted: 'var(--muted-text)',
          outline: 'var(--outline)',
          board: 'var(--board)',
          cell: 'var(--cell)',
          called: 'var(--called-cell)',
          complete: 'var(--bingo-complete)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}
