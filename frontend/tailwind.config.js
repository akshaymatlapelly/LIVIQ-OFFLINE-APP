/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liviq: {
          bg: '#FBFBF8',
          card: '#FFFFFF',
          border: 'rgba(0, 0, 0, 0.08)',
          text: '#0F172A',
          muted: '#64748B',
          emerald: '#10B981',
          lime: '#84CC16',
          limeLight: '#ECFDF5',
          black: '#000000',
          teal: '#0D9488',
          rose: '#F43F5E',
        },
        sentrix: {
          bg: '#FBFBF8',
          card: '#FFFFFF',
          border: 'rgba(0, 0, 0, 0.08)',
          text: '#0F172A',
          muted: '#64748B',
          lime: '#84CC16',
          limeLight: '#ECFDF5',
          black: '#000000',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan-line': 'scanLine 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.4' },
          '50%': { transform: 'translateY(90%)', opacity: '1' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
