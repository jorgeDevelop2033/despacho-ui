/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // asegúrate de incluir tus rutas
  ],
  theme: {
    extend: {
      animation: {
        fadeInZoom: 'fadeInZoom 0.4s ease-out forwards'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      keyframes: {
        fadeInZoom: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      }
    }
  },
  plugins: []
}
