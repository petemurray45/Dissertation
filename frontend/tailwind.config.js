import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern":
          "url('https://coolors.co/gradient-maker/f0edcc-ffffff?position=0,83&opacity=100,100&type=radial&rotation=90')",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["pastel"],
  },
};
