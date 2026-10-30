/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Fredoka",
          "Pretendard",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        display: ["Fredoka", "Pretendard", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          // Warm neutral scale (cream → ink). Dark-first names kept so existing
          // class names keep working: ink-950 = page background, ink-100 = text.
          950: "#F7F2E8",
          900: "#f4ede2",
          850: "#efe6d8",
          800: "#e9ded2",
          700: "#d9cbbb",
          600: "#b8a89a",
          500: "#8b8177",
          400: "#746d66",
          300: "#5a524c",
          200: "#3d3531",
          100: "#1E1915",
          50: "#1a1512",
        },
        paper: "#F7F2E8",
        line: "#DED5C6",
        brand: {
          // Terracotta
          50: "#fdf1ec",
          100: "#fbe0d5",
          200: "#f6c2ad",
          300: "#eea083",
          400: "#e6845f",
          500: "#E2603F",
          600: "#c9573a",
          700: "#a8462f",
          800: "#873a29",
          900: "#6e3124",
        },
        accent: {
          cyan: "#2a9d8f",
          violet: "#8a6fb3",
          pink: "#df6b46",
        },
      },
      boxShadow: {
        soft: "none",
        glow: "0 0 0 1px rgba(223,107,70,0.3), 0 8px 32px -8px rgba(223,107,70,0.4)",
        card: "none",
        "card-hover":
          "none",
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
          "linear-gradient(rgba(40,33,29,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(40,33,29,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
    },
  },
  plugins: [],
};
