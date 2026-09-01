/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14213D",
          50: "#EEF1F7",
          100: "#D6DCE9",
          400: "#3A4E7A",
          600: "#1C2C52",
          700: "#14213D",
          800: "#0F1930",
          900: "#0A1222",
        },
        amber: {
          DEFAULT: "#E8A33D",
          50: "#FDF4E6",
          100: "#FAE6C2",
          400: "#EFB25E",
          600: "#D18B22",
        },
        ink: {
          DEFAULT: "#1C2333",
          muted: "#5B6478",
          faint: "#8991A3",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          sunken: "#F4F6F9",
          border: "#E4E8F0",
        },
        success: { DEFAULT: "#2F9E58", bg: "#E7F6ED" },
        danger: { DEFAULT: "#D64545", bg: "#FCEAEA" },
        progress: { DEFAULT: "#2D7DD2", bg: "#E8F1FB" },
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 33, 61, 0.06), 0 1px 12px rgba(20, 33, 61, 0.04)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
