"use client";

import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/shared/Container";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified Professionals",
    description:
      "Connect with trusted technicians who are carefully verified before joining our platform.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Your bookings and payments are protected with secure technology and reliable processes.",
  },
  {
    icon: Clock3,
    title: "Save Your Time",
    description:
      "Find the right professional quickly without spending hours searching for local services.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay confidently through secure online payment options after your booking is accepted.",
  },
  {
    icon: UsersRound,
    title: "Trusted Community",
    description:
      "Choose professionals based on real ratings, reviews, experience, and service history.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    description:
      "Get help when you need it with a platform designed to make your service journey easier.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-secondary/20 py-24 sm:py-28">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 top-20 -z-10 size-100 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 size-100 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
              Why FixItNow?
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Built around
              <span className="text-primary"> your peace of mind.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="max-w-xl text-base leading-7 text-muted-foreground lg:ml-auto"
          >
            We believe finding a reliable home service should feel
            simple, transparent, and stress-free. That&apos;s why every
            part of FixItNow is designed with you in mind.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                className="group bg-background p-7 transition-colors duration-300 hover:bg-primary/[0.03] sm:p-8"
              >
                {/* Icon */}
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}