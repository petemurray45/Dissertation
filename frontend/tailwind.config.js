import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /col-span-(1|2|3|4|5|6)/,
    },
    {
      pattern: /row-span-(1|2|3|4|5|6)/,
    },
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern":
          "url('https://coolors.co/gradient-maker/f0edcc-ffffff?position=0,83&opacity=100,100&type=radial&rotation=90')",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        beat: "beat 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-textshadow"),
    require("tailwind-scrollbar-hide"),
  ],
  daisyui: {
    themes: ["pastel"],
  },
};
