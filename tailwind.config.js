/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                inter: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                border: "var(--color-border)", /* gray-200 */
                input: "var(--color-input)", /* white */
                ring: "var(--color-ring)", /* Ethiopian transport authority blue */
                background: "var(--color-background)", /* gray-50 */
                foreground: "var(--color-foreground)", /* gray-800 */
                primary: {
                    DEFAULT: "var(--color-primary)", /* Ethiopian transport authority blue */
                    foreground: "var(--color-primary-foreground)", /* white */
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)", /* blue-600 */
                    foreground: "var(--color-secondary-foreground)", /* white */
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)", /* red-500 */
                    foreground: "var(--color-destructive-foreground)", /* white */
                },
                muted: {
                    DEFAULT: "var(--color-muted)", /* gray-100 */
                    foreground: "var(--color-muted-foreground)", /* gray-500 */
                },
                accent: {
                    DEFAULT: "var(--color-accent)", /* emerald-600 */
                    foreground: "var(--color-accent-foreground)", /* white */
                },
                popover: {
                    DEFAULT: "var(--color-popover)", /* white */
                    foreground: "var(--color-popover-foreground)", /* gray-800 */
                },
                card: {
                    DEFAULT: "var(--color-card)", /* white */
                    foreground: "var(--color-card-foreground)", /* gray-800 */
                },
                success: {
                    DEFAULT: "var(--color-success)", /* emerald-500 */
                    foreground: "var(--color-success-foreground)", /* white */
                },
                warning: {
                    DEFAULT: "var(--color-warning)", /* amber-500 */
                    foreground: "var(--color-warning-foreground)", /* white */
                },
                error: {
                    DEFAULT: "var(--color-error)", /* red-500 */
                    foreground: "var(--color-error-foreground)", /* white */
                },
                'text-primary': "var(--color-text-primary)", /* gray-800 */
                'text-secondary': "var(--color-text-secondary)", /* gray-500 */
                surface: "var(--color-surface)", /* white */
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'elevation': 'var(--shadow-md)',
                'elevation-lg': 'var(--shadow-lg)',
                'soft': '0 1px 3px rgba(0,0,0,0.1)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "slide-in": {
                    from: { transform: "translateY(-10px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
                "slide-in": "slide-in 0.3s ease-out",
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            zIndex: {
                '100': '100',
                '200': '200',
                '300': '300',
                '400': '400',
                '500': '500',
            },
        },
    },
    plugins: [],
}