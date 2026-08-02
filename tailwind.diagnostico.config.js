module.exports = {
  content: ["./diagnostico.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "deep-onyx": "#FAF8F5",
        "dark-deep": "#FAF8F5",
        "dark-surface": "#FFFFFF",
        "surface-container-low": "#FFFFFF",
        "warm-bone": "#111827",
        "white-broken": "#111827",
        "grey-warm": "#555555",
        "on-surface-variant": "#555555",
        "evolve-purple-glow": "#7C3AED",
        "action-purple": "#7C3AED",
        "glass-border": "rgba(17, 24, 39, 0.06)",
        "glass-surface": "rgba(255, 255, 255, 0.7)",
        "primary": "#7C3AED",
        "surface": "#FAF8F5",
        "background": "#FAF8F5",
        "primaryLight": "#a35ced"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.375rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "margin-mobile": "24px",
        "container-max": "1400px",
        "unit": "8px",
        "margin-tablet": "48px",
        "margin-desktop": "96px",
        "gutter": "32px"
      },
      fontFamily: {
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "body-md": ["Manrope", "sans-serif"],
        "label-caps": ["Manrope", "sans-serif"],
        "label-sm": ["Manrope", "sans-serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "display-md": ["Plus Jakarta Sans", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["2.25rem", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "body-md": ["1rem", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "label-caps": ["0.875rem", { "lineHeight": "1.4", "letterSpacing": "0.12em", "fontWeight": "600" }],
        "label-sm": ["0.8125rem", { "lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "body-lg": ["1.125rem", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-md": ["clamp(2rem, 1.5rem + 2.5vw, 3.5rem)", { "lineHeight": "1.1", "letterSpacing": "-0.03em", "fontWeight": "700" }],
        "display-lg": ["clamp(3rem, 2rem + 4vw, 5.25rem)", { "lineHeight": "1.05", "letterSpacing": "-0.04em", "fontWeight": "700" }],
        "headline-lg-mobile": ["1.875rem", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }]
      }
    }
  },
  plugins: [],
}
