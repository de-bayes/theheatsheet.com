import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "rgb(248 246 241 / <alpha-value>)",
        charcoal: "rgb(33 33 33 / <alpha-value>)",
        "meta-gray": "rgb(171 167 167 / <alpha-value>)",
        "brand-red": "rgb(212 43 43 / <alpha-value>)",
        "brand-red-dark": "rgb(184 28 28 / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
        logo: ["var(--font-cormorant-garamond)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
