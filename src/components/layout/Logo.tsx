"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="FixItNow home"
      className="group inline-flex items-center gap-2.5"
    >
      <motion.div
        whileHover={{ rotate: -8, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" />

        <Wrench
          className="relative z-10 size-5.5"
          strokeWidth={2.4}
        />
      </motion.div>

      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-foreground">
          Fix<span className="text-primary">It</span>Now
        </span>

        <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Home Services
        </span>
      </div>
    </Link>
  );
}