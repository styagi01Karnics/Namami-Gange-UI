/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Text',
          'SF Pro',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        deva: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      colors: {
        // Figma Ganga Plus tokens (node 2155:*)
        canvas: '#EEF8FC',
        card: '#FFFFFF',
        line: '#E7EEF7',
        brand: {
          DEFAULT: '#0768D2',
          light: '#B7D4F5',
          soft: '#E5F3FF',
          link: '#0768D2',
        },
        navy: '#003C7A',
        ink: {
          DEFAULT: '#07121E',
          soft: '#646464',
          muted: '#7B8A9C',
        },
        ok: { DEFAULT: '#168E3F', soft: '#EAF3EC' },
        warn: { DEFAULT: '#F69A30', soft: '#FEF7E6' },
        danger: { DEFAULT: '#DC2626', soft: '#F5E7E7' },
        slate2: { DEFAULT: '#333333', soft: '#F1F4F7' },
        orange: { DEFAULT: '#F69A30' },
        label: '#B0894F',
      },
      boxShadow: {
        card: '0px 0px 3px 3px rgba(7, 104, 210, 0.1)',
        pop: '0 8px 24px rgba(23, 43, 77, 0.10)',
      },
      borderRadius: {
        card: '12px',
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        '3xs': ['9px', '12px'],
      },
    },
  },
  plugins: [],
}
