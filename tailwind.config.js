/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0E0E0E',
        'text-primary': '#F2F2F2',
        'accent': '#E50914',
        'accent-hover': '#B20710',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
