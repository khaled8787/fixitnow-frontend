
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("fixitnow-theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      document.documentElement.classList.toggle(
        "dark",
        systemDark,
      );

      setIsDark(systemDark);
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );

    localStorage.setItem(
      "fixitnow-theme",
      nextTheme,
    );

    setIsDark(nextTheme === "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-full"
        aria-label="Toggle theme"
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-9 rounded-full text-muted-foreground transition-colors hover:text-foreground"
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
