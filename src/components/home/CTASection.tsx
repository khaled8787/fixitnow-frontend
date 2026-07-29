"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/shared/Container";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary px-6 py-16 text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 sm:py-20 lg:px-20"
        >
          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/10" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full border border-primary-foreground/10" />

          <div className="pointer-events-none absolute right-20 top-10 size-24 rounded-full bg-primary-foreground/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
            >
              <Sparkles className="size-6" />
            </motion.div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Your home deserves the best.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-7 text-primary-foreground/75 sm:text-lg">
              Find trusted professionals, book a service, and get
              your home taken care of — all from one simple platform.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-7 text-sm font-semibold text-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore Services

                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-7 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/20"
              >
                Join FixItNow
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}