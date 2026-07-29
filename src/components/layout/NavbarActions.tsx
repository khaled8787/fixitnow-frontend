"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function NavbarActions() {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <ThemeToggle />

      <Button
        variant="ghost"
        className="rounded-full px-5"
      >
        <Link href="/auth/login">Login</Link>
      </Button>

      <Button className="group rounded-full px-5 shadow-lg shadow-primary/20">
        <Link
          href="/auth/register"
          className="flex items-center gap-1"
        >
          Get Started
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}