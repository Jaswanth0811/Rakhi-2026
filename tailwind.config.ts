import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: "#D4AF37",
        goldlight: "#F4E091",
        golddark: "#AA820A",
        charcoal: "#121214",
        warmblack: "#181616",
        cream: "#FAF6EE",
        rose: "#E07A5F",
        roselight: "#F2CC8F",
        pink: "#F4ACB7",
        pinklight: "#FFE5EC",
        lavender: "#C8B6E2",
        lavenderdark: "#7B61FF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-10px)" },
          "40%, 80%": { transform: "translateX(10px)" },
        },
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 15px rgba(212, 175, 55, 0.6))" },
          "50%": { filter: "drop-shadow(0 0 30px rgba(212, 175, 55, 0.9))" },
        },
      },
      animation: {
        "pulse-slow": "pulseSlow 6s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        glow: "glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
