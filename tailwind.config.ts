import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
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
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(36px, 6vw, 64px)", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display": ["clamp(28px, 4vw, 44px)", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "heading": ["clamp(20px, 2.5vw, 26px)", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        /* Ocean palette tokens */
        navy: {
          deep: "hsl(211, 73%, 13%)",
          ocean: "hsl(212, 66%, 17%)",
          light: "hsl(212, 50%, 25%)",
        },
        teal: {
          DEFAULT: "hsl(180, 87%, 35%)",
          light: "hsl(180, 70%, 50%)",
          pale: "hsl(189, 80%, 96%)",
        },
        ocean: {
          gray: "hsl(220, 9%, 46%)",
          border: "hsl(214, 32%, 91%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        "card": "0 4px 24px -4px hsl(211 73% 13% / 0.08)",
        "card-hover": "0 16px 40px -8px hsl(211 73% 13% / 0.14)",
        "teal": "0 8px 32px -8px hsl(180 87% 35% / 0.4)",
        "teal-lg": "0 16px 48px -8px hsl(180 87% 35% / 0.5)",
        "navy": "0 4px 24px -4px hsl(211 73% 13% / 0.3)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, hsl(211, 73%, 13%) 0%, hsl(212, 66%, 17%) 100%)",
        "gradient-teal": "linear-gradient(135deg, hsl(180, 87%, 35%) 0%, hsl(189, 70%, 50%) 100%)",
        "gradient-section": "linear-gradient(180deg, hsl(189, 80%, 96%) 0%, hsl(0, 0%, 100%) 100%)",
        "gradient-cta": "linear-gradient(135deg, hsl(189, 80%, 96%) 0%, hsl(180, 60%, 92%) 100%)",
        "gradient-metrics": "linear-gradient(135deg, hsl(211, 73%, 13%) 0%, hsl(212, 66%, 17%) 100%)",
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
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.35s ease-out",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
