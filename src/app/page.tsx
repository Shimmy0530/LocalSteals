/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import FilterBar from "@/components/FilterBar";
import DealFeed from "@/components/DealFeed";
import SearchOverlay from "@/components/SearchOverlay";

export default function Home() {
  const [showBigBox, setShowBigBox] = useState(false);
  const [category, setCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <TopBar onSearchOpen={() => setSearchOpen(true)} />

      {/* Spacer for fixed top bar */}
      <div className="h-14" />

      <FilterBar
        showBigBox={showBigBox}
        onToggleBigBox={() => setShowBigBox((prev) => !prev)}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Feed area with slight top padding */}
      <main className="pt-3">
        <DealFeed showBigBox={showBigBox} category={category} />
      </main>

      {/* Search overlay */}
      {searchOpen && (
        <SearchOverlay
          showBigBox={showBigBox}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
}