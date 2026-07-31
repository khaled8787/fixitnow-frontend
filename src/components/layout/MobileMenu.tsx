"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Info,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const mobileNavItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Services",
    href: "/services",
    icon: Settings,
  },
  {
    label: "Technicians",
    href: "/technicians",
    icon: Users,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((previous) => !previous)}
        className="size-10 rounded-full"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="absolute left-4 right-4 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-3xl border bg-background/95 p-3 shadow-2xl backdrop-blur-xl"
            >
              <nav className="space-y-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-3 h-px bg-border" />

              <button
                type="button"
                onClick={() =>
                  setTheme(isDark ? "light" : "dark")
                }
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <span className="flex items-center gap-3">
                  {isDark ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}

                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              <div className="mt-3 grid grid-cols-2 gap-2">
  <Button
    variant="outline"
    className="rounded-2xl"
    onClick={closeMenu}
  >
    <Link href="/login">Login</Link>
  </Button>

  <Button
    className="rounded-2xl"
    onClick={closeMenu}
  >
    <Link
      href="/register"
      className="flex items-center gap-1"
    >
      Get Started
      <ArrowRight className="size-4" />
    </Link>
  </Button>
</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}