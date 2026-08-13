"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";

interface Settings {
  storeName: string;
  currencySymbol: string;
  currencyCode: string;
  supportEmail?: string;
  supportPhone?: string;
  contactAddress?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  [key: string]: unknown;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export const SettingsProvider = ({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: Settings | null;
}) => {
  const [settings, setSettings] = useState<Settings | null>(initialSettings);
  const [loading, setLoading] = useState(!initialSettings);

  // Client-side fallback: if the server-side getGlobalSettings() failed
  // (initialSettings null), fetch once from the API so the UI never stays
  // in a permanent loading state.
  useEffect(() => {
    if (initialSettings) return;

    let cancelled = false;

    api
      .get("/settings")
      .then((res) => {
        if (!cancelled) setSettings(res.data?.data ?? null);
      })
      .catch(() => {
        // Swallow — components fall back to their branded defaults.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Helper hook for currency — Bangladeshi Taka by default.
export const useCurrency = () => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || "৳";
  const code = settings?.currencyCode || "BDT";

  const formatPrice = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `${symbol}${num.toLocaleString()}`;
  };

  return { symbol, code, formatPrice };
};
