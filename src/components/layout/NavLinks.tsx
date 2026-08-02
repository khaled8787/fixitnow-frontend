"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicNavItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "Technicians",
    href: "/technicians",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const navItems = [
    ...publicNavItems,
    ...(isAuthenticated
      ? [
          {
            label: "Dashboard",
            href: "/dashboard",
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-1 lg:flex"
      >
        {publicNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {isActive && (
              <motion.span
                layoutId="active-nav-pill"
                className="absolute inset-0 -z-10 rounded-full bg-secondary"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}

            <span
              className={
                isActive ? "text-foreground" : undefined
              }
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}