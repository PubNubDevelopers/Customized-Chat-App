import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/theme");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neutral50: "#FAFAFA",
        neutral300: "#D4D4D4",
        neutral900: "#171717",
        navy50: "#F8FAFC",
        navy100: "#F1F5F9",
        navy200: "#E2E8F0",
        navy500: "#64748B",
        navy600: "#475569",
        navy700: "#334155",
        navy900: "#161C2D",
        cherry: "#CD2026",
        cherryDark: "#B91C1C",
        pubnubbabyblue: "#C3E6FA",
        success: "#22C55E",
        inputring: "#57969C",
        statusIndicatorInfo100: "#DBEAFE",
        statusIndicatorSuccess100: "#DCFCE7",
      },
    },
  },
  darkMode: "selector",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {},
        },
        dark: {
          colors: {},
        },
      },
    }),
  ],
} satisfies Config;
