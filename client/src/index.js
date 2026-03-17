// =============================================
// index.js — React App Entry Point
// =============================================
// This is the FIRST file React runs.
// It finds the <div id="root"> in public/index.html
// and mounts the entire App component inside it.

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // import Tailwind styles globally
import App from "./App";

// Find the root div in public/index.html and mount React into it
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode helps catch bugs during development
  // It runs every component twice in dev mode to find side effects
  // It does NOT affect the production build
  <React.StrictMode>
    <App />
  </React.StrictMode>
);