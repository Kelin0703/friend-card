/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4a8eff',
          600: '#3a7aee',
          700: '#2d6ad9',
          800: '#2658b5',
          900: '#1f4891',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f6f8',
          hover: '#eef0f3',
        },
        border: {
          DEFAULT: '#e8eaed',
          strong: '#d0d3d9',
        },
        text: {
          DEFAULT: '#333333',
          muted: '#999999',
          light: '#bbbbbb',
        },
        status: {
          pending: {
            bg: '#fff7e6',
            text: '#d48806',
          },
          approved: {
            bg: '#f6ffed',
            text: '#389e0d',
          },
          revoked: {
            bg: '#fff1f0',
            text: '#cf1322',
          },
          danger: '#ff4d4f',
        },
      },
      borderRadius: {
        'full': '9999px',
        'card': '16px',
        'input': '9999px',
        'btn': '9999px',
      },
      boxShadow: {
        'btn-primary': '0 4px 12px rgba(74, 142, 255, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'avatar': '0 8px 24px rgba(74, 142, 255, 0.25)',
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
