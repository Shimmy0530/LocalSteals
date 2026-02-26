"use client";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "retail", label: "Retail" },
  { value: "auto-service", label: "Auto Service" },
] as const;

interface FilterBarProps {
  showBigBox: boolean;
  onToggleBigBox: () => void;
  category: string;
  onCategoryChange: (cat: string) => void;
}

export default function FilterBar({
  showBigBox,
  onToggleBigBox,
  category,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div
      className="sticky z-40 flex items-center gap-3 px-4 py-2.5 overflow-x-auto"
      style={{
        top: "56px", // below the 56px top bar
        backgroundColor: "rgba(20, 20, 20, 0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {/* Big Box toggle */}
      <button
        onClick={onToggleBigBox}
        className="flex items-center gap-2 shrink-0"
        aria-label={showBigBox ? "Hide big box deals" : "Show big box deals"}
      >
        <div className="toggle-track" data-on={String(showBigBox)}>
          <div className="toggle-thumb" />
        </div>
        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ color: showBigBox ? "#40916C" : "#737373" }}
        >
          Big Box
        </span>
      </button>

      {/* Divider */}
      <div className="w-px h-5 shrink-0" style={{ backgroundColor: "#2a2a2a" }} />

      {/* Category pills */}
      <div className="flex items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: isActive ? "#2D6A4F" : "#1a1a1a",
                color: isActive ? "#f5f5f5" : "#a3a3a3",
                border: isActive ? "1px solid #40916C" : "1px solid #2a2a2a",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#222222";
                  e.currentTarget.style.borderColor = "#333";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
