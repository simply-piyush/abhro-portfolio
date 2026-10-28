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
        brand: {
          DEFAULT: "#DB4726",
          bright: "#FF522B",
          dark: "#B8361A",
        },
        portfolio: {
          bg: "#C4C4C4",
          card: "#D9D9D9",
          dark: "#000000",
          border: "#DADADA",
        },
      },
      fontFamily: {
        anton: ["var(--font-anton)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        narnia: ["var(--font-narnia)", "sans-serif"],
        narina: ["var(--font-narina)", "var(--font-narnia)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap, 1rem)))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
