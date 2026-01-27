"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
  useRef,
} from "react";

type Theme = "forest" | "opalite";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "theme";
const DEFAULT_THEME: Theme = "forest";

function isValidTheme(value: string | null): value is Theme {
  return value === "forest" || value === "opalite";
}

// Custom hook to track if component has mounted (for SSR hydration)
function useHasMounted(): boolean {
  // Using useSyncExternalStore to safely track mount status
  return useSyncExternalStore(
    () => () => {}, // subscribe - no-op since mount status doesn't change
    () => true, // getSnapshot - client is always mounted
    () => false // getServerSnapshot - server is never mounted
  );
}

// Subscribe to storage events for cross-tab synchronization
function subscribeToTheme(callback: () => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === THEME_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return isValidTheme(stored) ? stored : DEFAULT_THEME;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useHasMounted();

  // Use useSyncExternalStore to read theme from localStorage
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  // Track if we've applied the theme to avoid unnecessary DOM updates
  const appliedThemeRef = useRef<Theme | null>(null);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    appliedThemeRef.current = newTheme;
    // Dispatch a storage event to trigger useSyncExternalStore update
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_KEY, newValue: newTheme })
    );
  }, []);

  // Apply theme to document when it changes (side effect for external system)
  useEffect(() => {
    if (isLoaded && appliedThemeRef.current !== theme) {
      document.documentElement.setAttribute("data-theme", theme);
      appliedThemeRef.current = theme;
    }
  }, [theme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
