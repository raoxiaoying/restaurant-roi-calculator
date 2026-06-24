import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          light: "hsl(var(--warning-light))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          light: "hsl(var(--danger-light))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontSize: {
        /* Display & Headings */
        'heading-xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],  /* 24px - Main page title */
        'heading-lg': ['1.25rem', { lineHeight: '1.3', fontWeight: '700' }], /* 20px - Section header */
        'heading-md': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],/* 18px - Subsection */
        
        /* Section & Component Titles */
        'section': ['0.875rem', { lineHeight: '1.4', fontWeight: '700' }],    /* 14px - Section title (bold) */
        'label-bold': ['0.8125rem', { lineHeight: '1.4', fontWeight: '700' }], /* 13px - Label (bold) */
        
        /* Body Text */
        'body': ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],      /* 15px - Regular body */
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],    /* 14px - Small body */
        
        /* Labels & Captions */
        'label': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],     /* 13px - Label text */
        'caption': ['0.75rem', { lineHeight: '1.3', fontWeight: '400' }],     /* 12px - Caption */
        'caption-xs': ['0.6875rem', { lineHeight: '1.2', fontWeight: '400' }],/* 11px - Tiny caption */
        
        /* Metric Values (Numbers) */
        'metric': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],         /* 32px - Large metric */
        'metric-sm': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],    /* 24px - Medium metric */
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'tab': 'var(--shadow-tab)',
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
