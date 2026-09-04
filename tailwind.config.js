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
        editor: {
          bg: '#0f1117',
          panel: '#161922',
          card: '#1e2230',
          border: '#2a2f42',
          accent: '#3b82f6',
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
