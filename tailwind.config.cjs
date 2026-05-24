/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef0ff',
          100: '#dfe3ff',
          200: '#c3caff',
          300: '#a5afff',
          400: '#828fff',
          500: '#5e6ad2',
          600: '#525db8',
          700: '#434c95',
          800: '#353c73',
          900: '#282d56',
        },
        secondary: {
          50: '#eef0ff',
          100: '#dfe3ff',
          200: '#c3caff',
          300: '#a5afff',
          400: '#828fff',
          500: '#5e6ad2',
          600: '#525db8',
          700: '#434c95',
          800: '#353c73',
          900: '#282d56',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'emoji-fly': 'emojifly 2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        emojifly: {
          '0%': { transform: 'translate(0, 0) scale(0.5)', opacity: '1' },
          '50%': { transform: 'translate(50%, -20%) scale(1.5)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0) scale(0.5)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
