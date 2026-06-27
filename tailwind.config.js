/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        data: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
        memo: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // TaxMind custom colors
        tm: {
          bg: {
            base: '#060810',
            surface: '#0A0D18',
            elevated: '#0F1422',
            overlay: '#141929',
            card: '#0C1020',
          },
          border: {
            DEFAULT: '#1A2038',
            mid: '#222C4A',
            bright: '#2C3A60',
          },
          brand: {
            DEFAULT: '#4F46E5',
            mid: '#6366F1',
            light: '#312E81',
            dim: '#1E1B4B',
            text: '#A5B4FC',
            glow: 'rgba(79, 70, 229, 0.18)',
          },
          tax: {
            savings: '#10B981',
            liability: '#EF4444',
            neutral: '#6B7280',
            opportunity: '#F59E0B',
            action: '#3B82F6',
            warning: '#DC2626',
          },
          entity: {
            ccorp: '#8B5CF6',
            scorp: '#3B82F6',
            partner: '#10B981',
            sole: '#F59E0B',
            trust: '#EC4899',
            exempt: '#6B7280',
          },
          status: {
            'not-started': '#374151',
            'in-progress': '#F59E0B',
            'review': '#8B5CF6',
            'filed': '#10B981',
            'extension': '#3B82F6',
            'overdue': '#EF4444',
          },
          text: {
            primary: '#E4E8F8',
            secondary: '#7885B8',
            muted: '#384060',
            number: '#F0F4FF',
            code: '#C7D2FE',
            cite: '#818CF8',
          },
          ai: {
            DEFAULT: '#4F46E5',
            dim: '#1E1B4B',
            text: '#A5B4FC',
          },
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: '0 0 20px rgba(79, 70, 229, 0.15)',
        'glow-lg': '0 0 40px rgba(79, 70, 229, 0.2)',
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "ticker": "ticker 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
