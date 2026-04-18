/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        display: ["Inter", "Pretendard", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#09090b",
          900: "#0c0c0e",
          850: "#111114",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
          500: "#52525b",
          400: "#71717a",
          300: "#a1a1aa",
          200: "#d4d4d8",
          100: "#e4e4e7",
          50: "#fafafa",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#5457e3",
          700: "#4b4ecb",
          800: "#3f42a6",
          900: "#353884",
        },
        accent: {
          cyan: "#22d3ee",
          violet: "#a855f7",
          pink: "#ec4899",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        glow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px -8px rgba(99,102,241,0.4)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.6)",
        "card-hover":
          "0 0 0 1px rgba(255,255,255,0.12), 0 12px 32px -12px rgba(0,0,0,0.8), 0 0 40px -12px rgba(99,102,241,0.25)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: 0, transform: "translateY(-16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "spring-in": {
          "0%": { opacity: 0, transform: "translateY(24px) scale(0.96)" },
          "60%": { opacity: 1, transform: "translateY(-4px) scale(1.01)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: 0.6 },
          "100%": { transform: "scale(2.4)", opacity: 0 },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(6%, -4%) scale(1.08)" },
          "66%": { transform: "translate(-4%, 6%) scale(0.96)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in-up":
          "fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in-down":
          "fade-in-down 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "spring-in":
          "spring-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        float: "float 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-dim":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
    },
  },
  plugins: [],
};
