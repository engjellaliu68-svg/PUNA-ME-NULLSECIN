import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e141b",
        sand: "#f6f1e9",
        accent: "#0f766e",
        coral: "#f97316",
        ocean: "#0ea5e9",
        moss: "#15803d",
        sun: "#fbbf24"
      }
    }
  },
  plugins: []
};

export default config;
