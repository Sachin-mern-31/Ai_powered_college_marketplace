/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          pink: '#ec4899',
          cyan: '#06b6d4',
        },
        dark: {
          card: '#1e293b',
          bg: '#0f172a',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
