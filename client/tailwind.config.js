/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020202",
        surface: "#0A0A0A",
        primary: {
          cyan: "#06b6d4", // Cyan-500
          violet: "#9d00ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.3)',
        'glow-violet': '0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-cyan': '0 0 5px #00f5ff, 0 0 20px #00f5ff',
        'neon-violet': '0 0 5px #9d00ff, 0 0 20px #9d00ff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
