/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette (preferred for all new code)
        "brand-navy": "#0B1426",
        "brand-navy-light": "#1A1F71",
        "brand-purple": "#2E1A47",
        "brand-purple-light": "#4C2A6A",
        "brand-teal": "#14B8A6",
        "brand-teal-dark": "#0D9488",
        "brand-gold": "#C7A040",
        "brand-gold-light": "#E5C76B",
        "brand-cream": "#FFF6E0",
        "brand-muted": "#5F5F5F",
        "brand-orange": "#CE5F44",
        "brand-yellow": "#F9AE53",
        "brand-sky": "#16A1C0",

        // Partner dashboard surfaces
        "surface-cream": "#f7f2eb",
        "surface-panel": "#fcfaf6",
        "border-warm": "#ebe2d3",
        "dashboard-gold": "#c9a44a",

        "dashboard-text": "#1c1c1c",
        "dashboard-muted": "#8e816d",
        "dashboard-border-light": "#e6dccd",
        "dashboard-input-border": "#ddd3c4",
        "dashboard-warn-border": "#e4b2a8",
        "dashboard-warn-bg": "#fff3f0",
        "dashboard-warn-text": "#9f4332",
        "dashboard-subtle": "#f9f6f0",

        // Homepage dusk marketplace palette (do not reuse on auth/checkout)
        "market-bg": "#120B2F",
        "market-surface": "#18123A",
        "market-elevated": "#211747",
        "market-header": "#0A0618",
        "market-pill": "#2D2652",
        "market-text": "#EDE7FF",
        "market-muted": "#BDB5E8",
        "market-gold": "#E2B84B",
        "market-gold-hover": "#F5D76E",
        "market-teal": "#2DD4BF",
        "market-glow": "#7E22CE",

        // Legacy aliases — deprecated, use brand-* equivalents
        "custom-orange": "#CE5F44",
        "custom-yellow": "#F9AE53",
        "custom-blue": "#16A1C0",
        "custom-soil": "#FFF6E0",
        "custom-dark": "#333333",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0B1426 0%, #2E1A47 50%, #1A1F71 100%)",
        "hero-gradient":
          "linear-gradient(180deg, rgba(11,20,38,0.85) 0%, rgba(46,26,71,0.75) 100%)",
        "market-hero":
          "linear-gradient(135deg, rgba(18,11,47,0.92) 0%, rgba(33,23,71,0.88) 45%, rgba(126,34,206,0.25) 100%)",
        "market-glow-radial":
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(126,34,206,0.22) 0%, transparent 70%)",
        "market-cta-band":
          "linear-gradient(135deg, #120B2F 0%, #211747 50%, rgba(126,34,206,0.35) 100%)",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.15)",
        "market-card":
          "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)",
        "market-glow": "0 0 40px rgba(126,34,206,0.18)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        mulish: ["var(--font-mulish)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
