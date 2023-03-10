/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      first: ['Chivo Mono', 'monospace'],
      second: ['DM Serif Display', 'serif'],
      third: ['Open Sans', 'sans-serif'],
      fourth: ['Playfair Display', 'serif'],
      fifth: ['Quattrocento Sans', 'sans-serif'],
      six: ['Rubik', 'sans-serif'],
      seven: ['Shantell Sans', 'cursive']
    },
  },
  plugins: [],
};

// font-family: 'Chivo Mono', monospace;
// font-family: 'DM Serif Display', serif;
// font-family: 'Open Sans', sans-serif;
// font-family: 'Playfair Display', serif;
// font-family: 'Quattrocento Sans', sans-serif;
// font-family: 'Rubik', sans-serif;
// font-family: 'Rubik 80s Fade', cursive;
// font-family: 'Smokum', cursive;
// font-family: 'Shantell Sans', cursive;