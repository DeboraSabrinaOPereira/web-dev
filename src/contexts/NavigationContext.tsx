"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface NavigationValue {
  path: string;
  navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

function pathFromHash() {
  if (typeof window === "undefined") return "/";
  const value = window.location.hash.replace(/^#/, "");
  return value.startsWith("/") ? value : "/";
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState("/");

  useEffect(() => {
    const sync = () => setPath(pathFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const value = useMemo<NavigationValue>(
    () => ({
      path,
      navigate(nextPath) {
        const normalized = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
        if (pathFromHash() === normalized) {
          setPath(normalized);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        window.location.hash = normalized;
      },
    }),
    [path],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const value = useContext(NavigationContext);
  if (!value) {
    throw new Error("useNavigation deve ser usado dentro de NavigationProvider.");
  }
  return value;
}

export function AppLink({
  to,
  children,
  className,
  onClick,
  ariaLabel,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const { navigate } = useNavigation();
  return (
    <a
      href={`#${to}`}
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
