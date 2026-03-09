/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

// Color palette — v2 design tokens
export const colors = {
  // Primary — forest green
  forest: {
    DEFAULT: "#2D6A4F",
    light: "#3A8A66",
    muted: "rgba(45,106,79,0.15)",
  },
  // Accent — orange (deals, CTAs, promotions)
  orange: {
    DEFAULT: "#E8772E",
    muted: "rgba(232,119,46,0.12)",
  },
  // Alert — red (errors, urgency, destructive)
  red: {
    DEFAULT: "#D63B2F",
    muted: "rgba(214,59,47,0.10)",
  },
  // Neutral scale
  bg: {
    dark: "#0a0a0a",
    surface: "#141414",
    surfaceRaised: "#1e1e1e",
    border: "#2a2a2a",
    disabled: "#3a3a3a",
  },
  // Text
  text: {
    primary: "#f0f0eb",
    secondary: "#8a8a82",
    muted: "#5c5c56",
  },
} as const;