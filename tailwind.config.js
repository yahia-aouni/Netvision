/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6B00', dark: '#CC5500', light: '#FF8533' },
        secondary: { DEFAULT: '#0A2540', dark: '#061A2E', light: '#1E3A5F' },
        accent: { DEFAULT: '#FF8C00', dark: '#FF6B00', light: '#FFB347' },
        background: '#F8FAFC', card: '#FFFFFF',
        text: { primary: '#0A2540', secondary: '#64748B' },
        success: '#10B981', warning: '#F59E0B', error: '#EF4444'
      },
      fontFamily: { sans: ['IBM Plex Sans Arabic', 'sans-serif'] }
    }
  },
  plugins: []
}