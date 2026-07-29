"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

import Container from "@/components/shared/Container";

const floatingItems = [
  {
    icon: ShieldCheck,
    label: "Verified Pros",
    position: "left-0 top-16",
    delay: 0.2,
  },
  {
    icon: Star,
    label: "Top Rated",
    position: "right-0 top-28",
    delay: 0.4,
  },
  {
    icon: Wrench,
    label: "Fast Service",
    position: "bottom-16 left-8",
    delay: 0.6,
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-150 w-150 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid min-h-[calc(100vh-4.5rem)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="size-4" />

              <span>Trusted home services, made simple</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              Your home.
              <br />

              <span className="bg-linear-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Our expertise.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Find trusted professionals for every job around your home.
              From quick repairs to complete installations, FixItNow
              connects you with skilled technicians you can rely on.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30"
              >
                Explore Services

                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/technicians"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-7 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary"
              >
                Find a Technician
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "Verified professionals",
                "Secure booking",
                "Reliable service",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative mx-auto w-full max-w-140"
          >
            {/* Main Visual Card */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-border/60 bg-linear-to-br from-primary/10 via-background to-cyan-500/10 p-4 shadow-2xl shadow-primary/10">
              {/* Decorative Grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Main Circle */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
              >
                <div className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/40" />

                <div className="absolute -right-2 top-1/2 size-3 -translate-y-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />
              </motion.div>

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex size-44 flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-background/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:size-52"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Wrench className="size-7" />
                  </div>

                  <span className="text-sm font-semibold">
                    Everything fixed.
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    One trusted platform.
                  </span>
                </motion.div>
              </div>

              {/* Floating Items */}
              {floatingItems.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                    }}
                    transition={{
                      opacity: {
                        duration: 0.5,
                        delay: item.delay,
                      },
                      scale: {
                        duration: 0.5,
                        delay: item.delay,
                      },
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay,
                      },
                    }}
                    className={`absolute ${item.position} hidden items-center gap-3 rounded-2xl border border-border/70 bg-background/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex`}
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <span className="text-xs font-semibold">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
              }}
              className="absolute -bottom-7 left-1/2 w-[90%] -translate-x-1/2 rounded-2xl border border-border/70 bg-background/90 p-3 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    What service do you need?
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold">
                    Search for a service...
                  </p>
                </div>

                <Link
                  href="/services"
                  aria-label="Search services"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}