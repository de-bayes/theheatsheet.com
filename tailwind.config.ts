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
        cream: "#f8f6f1",
        charcoal: "#212121",
        "meta-gray": "#aba7a7",
        "brand-red": "#D42B2B",
        "brand-red-dark": "#B81C1C",
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
