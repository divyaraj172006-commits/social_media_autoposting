/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                linkedin: "#0077b5",
                "linkedin-light": "#00a0dc",
                "web3-bg": "#060d1a",
                "web3-surface": "#0d1b33",
                "cyber-blue": "#00f2fe",
                "cyber-purple": "#f093fb",
                "cyber-pink": "#f5576c",
                "cyber-green": "#00ff88",
                "neon-blue": "#4facfe",
                "neon-violet": "#a855f7",
                "neon-cyan": "#06b6d4",
            },
            backgroundImage: {
                "gradient-neon": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "gradient-cyber": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                "gradient-purple": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "gradient-linkedin": "linear-gradient(135deg, #0077B5 0%, #00a0dc 100%)",
                "gradient-twitter": "linear-gradient(135deg, #1d9bf0 0%, #0c7abf 100%)",
                "mesh-bg": "radial-gradient(at 40% 20%, hsla(228, 90%, 15%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(265, 80%, 10%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(200, 90%, 8%, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240, 70%, 12%, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(220, 90%, 8%, 1) 0px, transparent 50%)",
            },
            boxShadow: {
                "glow-blue": "0 0 20px rgba(79, 172, 254, 0.4), 0 0 40px rgba(79, 172, 254, 0.2)",
                "glow-purple": "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
                "glow-pink": "0 0 20px rgba(240, 147, 251, 0.4), 0 0 40px rgba(240, 147, 251, 0.2)",
                "glow-cyan": "0 0 20px rgba(0, 242, 254, 0.4), 0 0 40px rgba(0, 242, 254, 0.2)",
                "card": "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                "card-hover": "0 40px 80px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'glow-border': 'glowBorder 3s linear infinite',
                'float-blob': 'floatBlob 20s infinite ease-in-out',
                'particle': 'particle 8s linear infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'scanline': 'scanline 4s linear infinite',
            },
            keyframes: {
                glow: {
                    'from': { boxShadow: '0 0 10px rgba(79, 172, 254, 0.2)' },
                    'to': { boxShadow: '0 0 30px rgba(79, 172, 254, 0.6), 0 0 60px rgba(79, 172, 254, 0.2)' },
                },
                glowBorder: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '300% 50%' },
                },
                floatBlob: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(79, 172, 254, 0.4)' },
                    '50%': { opacity: '0.7', boxShadow: '0 0 25px rgba(79, 172, 254, 0.8), 0 0 50px rgba(79, 172, 254, 0.4)' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
            },
        },
    },
    plugins: [],
}
