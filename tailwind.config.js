/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#05070b',
        obsidian: '#090d14',
        lab: '#101827',
        circuit: '#1d2f46',
        electric: '#12a7ff',
        recovery: '#35f29b',
        kinetic: '#ff7a1a',
        alert: '#ff344d',
        ash: '#a8b3c7',
      },
      fontFamily: {
        display: ['Arial Narrow', 'Inter Tight', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Rajdhani', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'electric': '0 0 42px rgba(18, 167, 255, 0.28)',
        'recovery': '0 0 36px rgba(53, 242, 155, 0.22)',
        'danger': '0 0 34px rgba(255, 52, 77, 0.24)',
      },
      backgroundImage: {
        'track-grid':
          'linear-gradient(rgba(18,167,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(18,167,255,.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
