import { create } from 'zustand';

// Light ("দিনের আকাশ" day sky) is the default for every visitor; dark
// ("রাতের প্রশান্তি" night calm) is opt-in via the header toggle and remembered
// per browser. The pre-paint script in app/layout.tsx applies the saved choice
// before first paint, so this store only has to read and flip it.
export const THEME_STORAGE_KEY = 'ig-theme';

interface ThemeState {
  isDark: boolean;
  userTheme: unknown;
  toggleDark: () => void;
  setTheme: (theme: unknown) => void;
  initTheme: () => void;
}

const applyMode = (dark: boolean) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  } catch {
    // Storage blocked (private mode etc.) — the mode still applies for this visit.
  }
};

export const useThemeStore = create<ThemeState>()((set, get) => ({
  isDark: false,
  userTheme: null,
  setTheme: (theme) => set({ userTheme: theme }),
  toggleDark: () => {
    const next = !get().isDark;
    applyMode(next);
    set({ isDark: next });
  },
  initTheme: () => {
    if (typeof document === 'undefined') return;
    set({ isDark: document.documentElement.classList.contains('dark') });
  },
}));
