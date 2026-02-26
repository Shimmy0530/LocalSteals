"use client";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "retail", label: "Retail" },
  { value: "auto-service", label: "Auto Service" },
] as const;

interface FilterBarProps {
  demoMode: boolean;
  onToggleDemo: () => void;
  showBigBox: boolean;
  onToggleBigBox: () => void;
  category: string;
  onCategoryChange: (cat: string) => void;
}

export default function FilterBar({
  demoMode,
  onToggleDemo,
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
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      {/* Demo toggle */}
      <button
        onClick={onToggleDemo}
        className="flex items-center gap-2 shrink-0"
        aria-label={demoMode ? "Disable demo mode" : "Enable demo mode"}
      >
        <div className="toggle-track" data-on={String(demoMode)} data-variant="demo">
          <div className="toggle-thumb" />
        </div>
        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ color: demoMode ? "#D4A017" : "#5c5c56" }}
        >
          Demo
        </span>
      </button>

      {/* Divider */}
      <div className="w-px h-5 shrink-0" style={{ backgroundColor: "#2a2a2a" }} />

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
          style={{ color: showBigBox ? "#3A8A66" : "#5c5c56" }}
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
                backgroundColor: isActive ? "#2D6A4F" : "#141414",
                color: isActive ? "#ffffff" : "#8a8a82",
                border: isActive ? "1px solid #3A8A66" : "1px solid #2a2a2a",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#1e1e1e";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#141414";
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
