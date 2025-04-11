import type { Config } from "tailwindcss";
import "@/app/globals.css";

const config: Config = {
  darkMode: false,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        casbHeaderBg: "var(--navbarBg)",
        casbSearchBg: '#6e2eff',
        casbText: '#1d2128',
        casbSeaBlueSecondary: '#186788',
        casbBlueHover: '#014273',
        casbSeaBlueLight: '#28ACE2',
        casbSuccess: '#77C053',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
