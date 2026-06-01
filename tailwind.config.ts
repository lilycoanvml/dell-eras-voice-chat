import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dell-blue': '#007DB8',
        'dell-dark': '#0A0A0F',
        'dell-surface': '#12121A',
        'dell-muted': '#1E1E2E',
        'era-creator-primary': '#8B5CF6',
        'era-creator-secondary': '#EC4899',
        'era-innovator-primary': '#06B6D4',
        'era-innovator-secondary': '#3B82F6',
        'era-achiever-primary': '#F59E0B',
        'era-achiever-secondary': '#EF4444',
        'era-explorer-primary': '#10B981',
        'era-explorer-secondary': '#059669',
        'era-visionary-primary': '#DC2626',
        'era-visionary-secondary': '#7C3AED',
        'era-performer-primary': '#EF4444',
        'era-performer-secondary': '#F97316',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'star-drift': 'starDrift 20s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        starDrift: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(-100vh) translateX(20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
