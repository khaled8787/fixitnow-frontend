
"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function NavbarActions() {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* Theme */}
      <ThemeToggle />

      {/* Auth State */}
      {isLoading ? (
        <div className="hidden h-9 w-24 animate-pulse rounded-full bg-muted sm:block" />
      ) : isAuthenticated && user ? (
        <>
          {/* Profile */}
          <Link href="/profile">
            <Button
              variant="ghost"
              className="hidden rounded-full px-4 sm:flex"
            >
              <UserCircle className="mr-2 size-4" />

              <span className="max-w-[120px] truncate">
                {user.name}
              </span>
            </Button>
          </Link>

          {/* Logout */}
          <Button
            variant="outline"
            onClick={logout}
            className="hidden rounded-full px-4 sm:flex"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </>
      ) : (
        <>
          {/* Login */}
          <Button
            variant="ghost"
            className="hidden rounded-full px-5 sm:flex"
          >
            <Link href="/login">
              Login
            </Link>
          </Button>

          {/* Register */}
          <Button className="hidden rounded-full px-5 shadow-lg shadow-primary/20 sm:flex">
            <Link
              href="/register"
              className="flex items-center gap-1"
            >
              Get Started
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
