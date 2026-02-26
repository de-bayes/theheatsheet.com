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
        cream: "#fdfaf1",
        charcoal: "#212121",
        "meta-gray": "#aba7a7",
        "link-blue": "#1863DC",
        "brand-red": "#D42B2B",
        "brand-red-dark": "#B81C1C",
        "brand-blue": "#1E5FA8",
        "brand-blue-dark": "#174A87",
        "brand-orange": "#ff6100",
        "brand-bright-blue": "#1649ff",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
