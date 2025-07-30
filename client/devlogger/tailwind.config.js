

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
        Oxfordblue: '#11253F',
        Deftblue:"#1E3250",
        Royalblue:"#1760F8",
        Brandeisblue:"#2B6EFD",
        Whitesmoke:"#F3F3F3",
        White:"#FFFFFF"
      },
    },
  },
  plugins: [
  require('tailwind-scrollbar'),
  require('@tailwindcss/aspect-ratio')
  ],
}