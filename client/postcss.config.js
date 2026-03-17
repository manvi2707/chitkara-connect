// =============================================
// postcss.config.js — PostCSS Configuration
// =============================================
// PostCSS processes your CSS files.
// These two plugins are REQUIRED for Tailwind to work:
// 1. tailwindcss  → generates all utility classes
// 2. autoprefixer → adds vendor prefixes automatically
//                   e.g. -webkit-flex for older browsers

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};