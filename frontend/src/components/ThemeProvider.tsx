"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

// Ische Ghuree fallback palettes (DESIGN.md §1) — used when the DB is
// unreachable so the brand look survives any API outage.
// Light: "দিনের আকাশ" (day sky) — cloud white, kite-sky blue, jute tan.
const FALLBACK_LIGHT: Record<string, string> = {
  background: "204 45% 98%",
  foreground: "215 45% 15%",
  heading: "215 45% 15%",
  subheading: "215 25% 40%",
  card: "0 0% 100%",
  "card-foreground": "215 45% 15%",
  popover: "0 0% 100%",
  "popover-foreground": "215 45% 15%",
  primary: "204 80% 40%",
  "primary-foreground": "0 0% 100%",
  secondary: "33 45% 62%",
  "secondary-foreground": "27 50% 16%",
  muted: "204 30% 92%",
  "muted-foreground": "215 25% 40%",
  accent: "330 72% 52%",
  "accent-foreground": "0 0% 100%",
  destructive: "0 84% 60%",
  "destructive-foreground": "0 0% 98%",
  border: "204 25% 86%",
  input: "204 25% 86%",
  ring: "204 80% 40%",
  "shadow-color": "215 45% 15%",
  "gradient-from": "204 45% 98%",
  "gradient-to": "204 30% 92%",
};

// Dark: "রাতের প্রশান্তি" (night tranquility) — deep night blue, not black.
const FALLBACK_DARK: Record<string, string> = {
  background: "215 50% 8%",
  foreground: "204 40% 94%",
  heading: "204 40% 94%",
  subheading: "204 25% 65%",
  card: "215 45% 12%",
  "card-foreground": "204 40% 94%",
  popover: "215 45% 10%",
  "popover-foreground": "204 40% 94%",
  primary: "204 75% 55%",
  "primary-foreground": "215 50% 8%",
  secondary: "33 40% 55%",
  "secondary-foreground": "215 50% 8%",
  muted: "215 40% 14%",
  "muted-foreground": "204 25% 65%",
  accent: "330 70% 60%",
  "accent-foreground": "0 0% 100%",
  destructive: "0 84% 60%",
  "destructive-foreground": "0 0% 98%",
  border: "215 30% 20%",
  input: "215 35% 16%",
  ring: "204 75% 55%",
  "shadow-color": "215 80% 3%",
  "gradient-from": "215 45% 12%",
  "gradient-to": "215 50% 6%",
};

interface InitialTheme {
  lightVariables?: Record<string, string> | null;
  darkVariables?: Record<string, string> | null;
  radius?: string | null;
}

interface Props {
  children: React.ReactNode;
  initialTheme?: InitialTheme | null;
}

export default function ThemeProvider({ children, initialTheme }: Props) {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const lightVars: Record<string, string> = initialTheme?.lightVariables ?? FALLBACK_LIGHT;
  const darkVars: Record<string, string> = initialTheme?.darkVariables ?? FALLBACK_DARK;
  const radius = initialTheme?.radius ?? "0.75rem";

  const generateCSS = (vars: Record<string, string>) =>
    Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join(" ");

  return (
    <>
      <style suppressHydrationWarning>{`
        :root { ${generateCSS(lightVars)} --radius: ${radius}; }
        .dark  { ${generateCSS(darkVars)} }
      `}</style>
      {children}
    </>
  );
}
