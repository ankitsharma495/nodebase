/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'void-black': '#000000',
        'neon-green': '#00FF41',
        'nebula-violet': '#8A2BE2',
        primary: {
          DEFAULT: '#5551FF',
          50: '#EDEDFF',
          100: '#DBDAFF',
          200: '#B7B5FF',
          300: '#9390FF',
          400: '#6F6BFF',
          500: '#5551FF',
          600: '#1F1AFF',
          700: '#0400DE',
          800: '#0300A1',
          900: '#020064',
        },
        surface: {
          DEFAULT: '#0F0F0F',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          800: '#1A1A1A',
          900: '#0F0F0F',
          950: '#080808',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        'display-serif': ['Cinzel', 'serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        extreme: '0.5em',
        'widest-plus': '0.25em',
      },
      backgroundImage: {
        'nebula-texture': 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.08) 0%, rgba(0, 0, 0, 0) 60%)',
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'drift-up': 'driftUp 6s ease-in-out infinite',
        'line-scan': 'lineScan 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 25s linear infinite reverse',
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 10s ease-in-out 2s infinite',
        'scanner': 'scanner 4s ease-in-out infinite',
        'aurora': 'aurora 12s ease-in-out infinite',
        'aurora-alt': 'aurora 15s ease-in-out 3s infinite reverse',
        'glow-breathe': 'glowBreathe 4s ease-in-out infinite',
        'dash-move': 'dashMove 8s linear infinite',
        'trail': 'trail 3s ease-in-out infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
        'typing': 'typing 3s steps(20) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        driftUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        lineScan: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.6' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-5px)' },
          '75%': { transform: 'translateY(-25px) translateX(8px)' },
        },
        scanner: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        aurora: {
          '0%, 100%': { transform: 'translateX(-30%) translateY(-10%) rotate(0deg) scale(1)', opacity: '0.3' },
          '33%': { transform: 'translateX(10%) translateY(5%) rotate(60deg) scale(1.2)', opacity: '0.5' },
          '66%': { transform: 'translateX(-10%) translateY(-5%) rotate(120deg) scale(0.9)', opacity: '0.4' },
        },
        glowBreathe: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)', borderColor: 'rgba(0, 255, 65, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 65, 0.35)', borderColor: 'rgba(0, 255, 65, 0.6)' },
        },
        dashMove: {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        trail: {
          '0%': { transform: 'translateX(-100%) scaleX(0)', opacity: '0' },
          '50%': { transform: 'translateX(0%) scaleX(1)', opacity: '1' },
          '100%': { transform: 'translateX(100%) scaleX(0)', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '25%, 75%': { opacity: '0.9' },
          '12%, 38%, 62%, 88%': { opacity: '0.95' },
        },
        typing: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
      },
    },
  },
  plugins: [],
};
