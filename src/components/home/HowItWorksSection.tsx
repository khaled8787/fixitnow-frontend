"use client";

import { CalendarCheck2, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/shared/Container";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Service",
    description:
      "Browse trusted home services and discover the right professional for your needs.",
  },
  {
    number: "02",
    icon: CalendarCheck2,
    title: "Book a Professional",
    description:
      "Choose your preferred technician, select an available time slot, and send your booking request.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Relax, We’ve Got It",
    description:
      "Once your technician accepts the request, pay securely and track your service from start to finish.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-150 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
            Simple & Seamless
          </div>

          <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            Getting help has
            <span className="text-primary"> never been easier.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            From finding the right professional to getting the job
            done, FixItNow makes every step simple and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting Line */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-16 hidden h-px border-t border-dashed border-border md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                className="relative text-center"
              >
                {/* Icon */}
                <div className="relative mx-auto flex size-32 items-center justify-center rounded-full border border-border/60 bg-background shadow-xl shadow-black/5">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform duration-500 hover:rotate-6 hover:scale-105">
                    <Icon className="size-9" strokeWidth={1.7} />
                  </div>

                  {/* Number */}
                  <span className="absolute -right-1 top-1 flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-bold text-primary-foreground shadow-lg">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mx-auto mt-7 max-w-sm">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}