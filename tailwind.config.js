/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0f172a',
        card: '#111c34',
        border: '#1e293b',
        accent: '#38bdf8',
        accentSoft: '#0f3b5a',
        success: '#34d399',
        warning: '#f59e0b',
        danger: '#fb7185',
      },
      boxShadow: {
        glow: '0 20px 45px -25px rgba(56, 189, 248, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%), linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 1))',
      },
    },
  },
  plugins: [],
};
