/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lemon': '#fff700', // رنگ لیمویی
        'light-lemon': '#f9f871', // رنگ لیمویی روشن‌تر
      },
    },
  
  },
  plugins: [],
}
