/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LocalSteals",
    short_name: "LocalSteals",
    description: "Chicagoland local deals aggregator",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#2D6A4F",
    icons: [
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}