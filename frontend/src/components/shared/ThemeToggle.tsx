"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { useThemeStore } from "@/store/themeStore";

// Header light/dark switch. Shows the mode you'd switch *to*: a moon in light
// mode, a sun in dark mode.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggleDark } = useThemeStore();
  const label = isDark ? "দিনের মোড — Switch to light mode" : "রাতের মোড — Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={label}
      title={label}
      className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary transition-colors ${className}`}
    >
      {isDark ? <LuSun className="w-5 h-5" /> : <LuMoon className="w-5 h-5" />}
    </button>
  );
}
