/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      colors: {
        // page / surfaces
        canvas: '#F4F8FD',
        card: '#FFFFFF',
        line: '#E7EEF7',
        // brand
        brand: {
          DEFAULT: '#1668E3',
          light: '#B9D4F7',
          soft: '#E8F1FD',
          link: '#2B7CF6',
        },
        navy: '#1B4B79',
        ink: {
          DEFAULT: '#22303F',
          soft: '#4A5A6D',
          muted: '#7B8A9C',
        },
        ok: { DEFAULT: '#2E9E5B', soft: '#EAF7EF' },
        warn: { DEFAULT: '#F5B417', soft: '#FEF7E6' },
        danger: { DEFAULT: '#E5484D', soft: '#FDECEE' },
        slate2: { DEFAULT: '#3A4450', soft: '#F1F4F7' },
        orange: { DEFAULT: '#EE9B2C' },
        label: '#B0894F',
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 43, 77, 0.04), 0 2px 12px rgba(23, 43, 77, 0.04)',
        pop: '0 8px 24px rgba(23, 43, 77, 0.10)',
      },
      borderRadius: {
        card: '14px',
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        '3xs': ['9px', '12px'],
      },
    },
  },
  plugins: [],
}
