/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#070708', 900: '#0B0B0D', 800: '#121214', 700: '#1A1A1D', 600: '#26262A', 500: '#3A3A40' },
        gold: { 200: '#F3E2B3', 300: '#E8C872', 400: '#D9B45C', 500: '#C9A24A', 600: '#A67C2E', 700: '#7F5C1F' },
        sand: { 50: '#F7F2E7', 100: '#EFE6D3', 300: '#C8BFAC', 400: '#A8A39A' },
      },
      fontFamily: {
        display: ['"Cairo"', 'system-ui', 'sans-serif'],
        body: ['"Tajawal"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg,#F3E2B3 0%,#D9B45C 35%,#A67C2E 70%,#E8C872 100%)',
        'gold-line': 'linear-gradient(90deg,transparent,#C9A24A,transparent)',
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(201,162,74,.35)',
        card: '0 20px 60px -20px rgba(0,0,0,.7)',
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        drift: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: { rise: 'rise .9s cubic-bezier(.2,.7,.2,1) both', shimmer: 'shimmer 6s linear infinite', drift: 'drift 7s ease-in-out infinite' },
    },
  },
  plugins: [],
};
