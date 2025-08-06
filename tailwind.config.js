const defaultTheme = require('tailwindcss/defaultTheme')

// tailwind.config.js
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        gold: '#ffb400',
        slateblue: '#202938',
        // Brand Colors for Executive Speech Coaching NYC
        'brand': {
          'primary': '#0a1a2b',
          'accent': '#ffb400',
          'navy': {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0a1a2b',
            950: '#020617'
          },
          'gold': {
            50: '#fffef7',
            100: '#fffbeb',
            200: '#fef3c7',
            300: '#fde68a',
            400: '#fcd34d',
            500: '#ffb400',
            600: '#f59e0b',
            700: '#d97706',
            800: '#b45309',
            900: '#92400e',
            950: '#78350f'
          }
        },
        'primary': {
          DEFAULT: '#0a1a2b',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0a1a2b'
        },
        'secondary': {
          DEFAULT: '#EC4899',
          50: '#FDEEF6',
          100: '#FBDCEB',
          200: '#F8B7D7',
          300: '#F492C2',
          400: '#F06DAE',
          500: '#EC4899',
          600: '#E4187D',
          700: '#B11261',
          800: '#7F0D45',
          900: '#4C0829'
        },
        'neutral': {
          DEFAULT: '#6B7280',
          50: '#CDD0D5',
          100: '#C2C5CC',
          200: '#ACB0BA',
          300: '#969BA7',
          400: '#7F8694',
          500: '#6B7280',
          600: '#515761',
          700: '#383C43',
          800: '#1E2024',
          900: '#050506'
        },
        // To change these, use https://www.tailwindshades.com/ with https://tailwindcss.com/docs/customizing-colors or create your own custom colors.
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to bottom, #fff0 86%, #ffb400 86%, #ffb400 98%, #fff0 98%)',
        'brand-gradient': 'linear-gradient(135deg, #0a1a2b 0%, #1e293b 100%)',
        'gold-shine': 'linear-gradient(135deg, #ffb400 0%, #f59e0b 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(10, 26, 43, 0.1)',
        'brand-lg': '0 10px 25px -3px rgba(10, 26, 43, 0.1), 0 4px 6px -2px rgba(10, 26, 43, 0.05)',
        'gold': '0 4px 14px 0 rgba(255, 180, 0, 0.25)',
        'gold-lg': '0 10px 25px -3px rgba(255, 180, 0, 0.1), 0 4px 6px -2px rgba(255, 180, 0, 0.05)',
      },
      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.zinc[800]'),
            '--tw-prose-headings': theme('colors.zinc[900]'),
            '--tw-prose-lead': theme('colors.zinc[700]'),
            '--tw-prose-links': theme('colors.zinc[900]'),
            '--tw-prose-bold': theme('colors.zinc[900]'),
            '--tw-prose-counters': theme('colors.zinc[600]'),
            '--tw-prose-bullets': theme('colors.zinc[400]'),
            '--tw-prose-hr': theme('colors.zinc[300]'),
            '--tw-prose-quotes': theme('colors.zinc[900]'),
            '--tw-prose-quote-borders': theme('colors.zinc[300]'),
            '--tw-prose-captions': theme('colors.zinc[700]'),
            '--tw-prose-code': theme('colors.indigo[500]'),
            '--tw-prose-pre-code': theme('colors.indigo[300]'),
            '--tw-prose-pre-bg': theme('colors.gray[900]'),
            '--tw-prose-th-borders': theme('colors.zinc[300]'),
            '--tw-prose-td-borders': theme('colors.zinc[200]'),
            '--tw-prose-invert-body': theme('colors.zinc[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.zinc[300]'),
            '--tw-prose-invert-links': theme('colors.indigo[400]'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.zinc[400]'),
            '--tw-prose-invert-bullets': theme('colors.zinc[200]'),
            '--tw-prose-invert-hr': theme('colors.zinc[500]'),
            '--tw-prose-invert-quotes': theme('colors.zinc[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.zinc[700]'),
            '--tw-prose-invert-captions': theme('colors.zinc[400]'),
            '--tw-prose-invert-code': theme('colors.indigo[400]'),
            '--tw-prose-invert-pre-code': theme('colors.indigo[300]'),
            '--tw-prose-invert-pre-bg': theme('colors.gray[900]'),
            '--tw-prose-invert-th-borders': theme('colors.zinc[100]'),
            '--tw-prose-invert-td-borders': theme('colors.zinc[500]'),
          },
        },
      }),
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
