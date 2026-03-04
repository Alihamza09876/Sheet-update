/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'shake': 'shake 0.5s ease-in-out',
                'bounce-subtle': 'bounce-subtle 3s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-200%)' },
                    '100%': { transform: 'translateX(200%)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-5px)' },
                    '40%, 80%': { transform: 'translateX(5px)' },
                },
                'bounce-subtle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            },
        },
    },
    plugins: [],
}
