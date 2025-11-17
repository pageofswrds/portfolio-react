import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      little: "490px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      smmax: { max: "639px" },
      xsmax: { max: "479px" },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    fontFamily: {
      serif: ["var(--font-serif-theme)"],
      mono: ["var(--font-mono-theme)"],
      fraktion: ["var(--font-fraktion)"],
    },
    fontSize: {
      xs: ["0.813rem", { lineHeight: "1rem", letterSpacing: "0.02rem" }],
      sm: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.02rem" }],
      md: ["1.25rem", { lineHeight: "2rem", letterSpacing: "0.02rem" }],
      lg: ["1.625rem", { lineHeight: "2.625rem", letterSpacing: "0.02rem" }],
      xl: ["2.063rem", { lineHeight: "3.25rem", letterSpacing: "0.02rem" }],
    },
    fontWeight: {
      "400": "400",
      "500": "500",
      "600": "600",
    },
    extend: {
      colors: {
        invert: "#FFFFFF",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        light: "hsl(var(--light-100))",
        dark: "hsl(var(--dark-800))",
        brand: "hsl(var(--brand))",

        tx: {
          DEFAULT: "hsl(var(--dark-800))",
          body: "hsl(var(--dark-800) / 0.95)",
          primary: "hsl(var(--dark-800))",
          secondary: "hsl(var(--dark-800) / 0.7)",
          tertiary: "hsl(var(--dark-800) / 0.5)",
          disabled: "hsl(var(--dark-800) / 0.22)",
          button: "hsl(var(--light-100))",
          brand: {
            DEFAULT: "hsl(var(--brand) / 0.95)",
            disabled: "hsl(var(--brand) / 0.35)",
          },
        },

        ic: {
          DEFAULT: "hsl(var(--dark-800))",
          primary: "hsl(var(--dark-800) / 0.9)",
          secondary: "hsl(var(--dark-800) / 0.6)",
          tertiary: "hsl(var(--dark-800) / 0.4)",
          disabled: "hsl(var(--dark-800) / 0.15)",
          button: "hsl(var(--light-100))",
          brand: {
            DEFAULT: "hsl(var(--brand) / 0.9)",
            disabled: "hsl(var(--brand) / 0.5)",
          },
        },

        bg: {
          DEFAULT: "hsl(var(--light-100))",
          base: "hsl(var(--light-200))",
          card: {
            DEFAULT: "hsl(var(--light-100))",
            hover: "hsl(var(--light-150))",
            pressed: "hsl(var(--light-300))",
          },
          primary: "hsl(var(--dark-800) / 0.08)",
          secondary: "hsl(var(--dark-800) / 0.03)",
          hover: "hsl(var(--dark-800) / 0.12)",
          pressed: "hsl(var(--dark-800) / 0.15)",
          disabled: "hsl(var(--dark-800) / 0.04)",
          brand: {
            DEFAULT: "hsl(var(--brand) / 0.12)",
            hover: "hsl(var(--brand) / 0.18)",
            pressed: "hsl(var(--brand) / 0.22)",
            disabled: "hsl(var(--brand) / 0.06)",
          },
          button: {
            DEFAULT: "hsl(var(--dark-800))",
            hover: "hsl(var(--dark-900) / 0.18)",
            pressed: "hsl(var(--dark-950) / 0.22)",
            disabled: "hsl(var(--brand) / 0.15)",
            brand: "hsl(var(--brand))",
          },
        },

        bd: {
          DEFAULT: "hsl(var(--light-900))",
          base: "hsl(var(--light-900) / 0.8)",
          card: "hsl(var(--light-600) / 0.35)",
          primary: "hsl(var(--dark-800) / 0.15)",
          secondary: "hsl(var(--dark-800) / 0.08)",
          hover: "hsl(var(--dark-800) / 0.17)",
          pressed: "hsl(var(--dark-800) / 0.18)",
          disabled: "hsl(var(--dark-800) / 0.05)",
          brand: {
            DEFAULT: "hsl(var(--brand) / 0.55)",
            hover: "hsl(var(--brand) / 0.6)",
            pressed: "hsl(var(--brand) / 0.63)",
            disabled: "hsl(var(--brand) / 0.15)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // borderStyle: {
      //   dashed: "",
      // },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // bgImage: {
      //   'dot-pattern': "url('/patterns/dot-bg.png')",
      //   'topo-pattern': "url('/patterns/topo-bg.png')",
      // },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
    function ({
      addVariant,
    }: {
      addVariant: (name: string, selector: string) => void;
    }) {
      addVariant("theme-forest", '[data-theme="forest"] &');
      addVariant("theme-opalite", '[data-theme="opalite"] &');
    },
  ],
};

export default config;
