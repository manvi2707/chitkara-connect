// =============================================
// tailwind.config.js — Tailwind Configuration
// =============================================
// Tells Tailwind WHICH files to scan for class names.
// Any Tailwind class used in these files gets included
// in the final CSS build. Unused classes are removed.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // scans ALL .js and .jsx files inside src/
    // this finds every className="..." you wrote
  ],
  theme: {
    extend: {
      // Add custom colors here if needed
      // Example:
      // colors: {
      //   chitkara: {
      //     blue: "#1e3a8a",
      //     green: "#166534",
      //   }
      // }
    },
  },
  plugins: [
    // Add Tailwind plugins here if needed
    // Example: require('@tailwindcss/forms')
  ],
};