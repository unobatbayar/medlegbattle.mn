import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"]
      },
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eef0f8",
          200: "#d6dcf3",
          300: "#b0bee8",
          400: "#7f93db",
          500: "#516ad0",
          600: "#3e50b7",
          700: "#30408f",
          800: "#243069",
          900: "#192044"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.1), 0 12px 50px rgba(80,105,208,0.25)"
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pop: {
          "0%": { transform: "scale(0.98)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 180ms ease-out"
      }
    }
  },
  plugins: []
} satisfies Config;


