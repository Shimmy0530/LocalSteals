// Color palette derived from the LocalSteals logo
export const colors = {
  // Primary - dark forest green (circle border, "Local Steals" text)
  green: {
    DEFAULT: "#2D6A4F",
    light: "#40916C",
    dark: "#1B4332",
  },
  // Accent - vibrant orange ("Crazy Deals" text, shopping bag)
  orange: {
    DEFAULT: "#E8772E",
    light: "#F4A261",
    dark: "#D45D10",
  },
  // Highlight - red accent (map pins, shadows)
  red: {
    DEFAULT: "#D63B2F",
    light: "#E76F51",
  },
  // Neutrals - dark mode backgrounds
  bg: {
    primary: "#0a0a0a",
    secondary: "#141414",
    card: "#1a1a1a",
    hover: "#222222",
  },
  // Text
  text: {
    primary: "#f5f5f5",
    secondary: "#a3a3a3",
    muted: "#737373",
  },
} as const;
