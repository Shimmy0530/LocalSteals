"use client";

import Image from "next/image";
import Link from "next/link";

interface TopBarProps {
  onSearchOpen: () => void;
}

export default function TopBar({ onSearchOpen }: TopBarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      {/* Logo + App Name */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <Image
          src="/logo.png"
          alt="LocalSteals logo"
          width={34}
          height={34}
          className="rounded-md"
          priority
        />
        <span
          className="text-lg font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            color: "#f0f0eb",
          }}
        >
          Local
          <span style={{ color: "#E8772E" }}>Steals</span>
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Search button */}
        <button
          onClick={onSearchOpen}
          aria-label="Search deals"
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ color: "#8a8a82" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1e1e1e";
            e.currentTarget.style.color = "#f0f0eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8a8a82";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {/* Settings link */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ color: "#8a8a82" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1e1e1e";
            e.currentTarget.style.color = "#f0f0eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8a8a82";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
