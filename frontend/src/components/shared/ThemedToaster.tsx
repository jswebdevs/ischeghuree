"use client";

import { Toaster } from "sonner";
import { useThemeStore } from "@/store/themeStore";

// Centered toaster styled with the Ische Ghuree theme tokens (sky-blue
// primary). Palette changes in the DB flow through here automatically, and it
// follows the header light/dark switch.
export default function ThemedToaster() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <Toaster
      position="top-center"
      offset="40vh"
      mobileOffset="35vh"
      theme={isDark ? "dark" : "light"}
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !border !border-primary/30 !text-foreground !shadow-2xl !shadow-primary/10 !rounded-2xl",
          title: "!text-foreground !font-bold !tracking-tight",
          description: "!text-muted-foreground",
          actionButton:
            "!bg-primary !text-primary-foreground !font-black !uppercase !tracking-widest !rounded-lg !cursor-pointer hover:!bg-primary/90",
          cancelButton:
            "!bg-transparent !text-muted-foreground !border !border-border !font-bold !uppercase !tracking-widest !rounded-lg !cursor-pointer hover:!text-foreground",
          closeButton:
            "!bg-card !border !border-border !text-muted-foreground hover:!text-foreground !cursor-pointer",
          success: "!border-emerald-500/40 !text-emerald-700 dark:!text-emerald-200",
          error: "!border-destructive/40 !text-destructive",
          warning: "!border-secondary/40 !text-secondary",
          info: "!border-primary/40 !text-primary",
        },
      }}
    />
  );
}
