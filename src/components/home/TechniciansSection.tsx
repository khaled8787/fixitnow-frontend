"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/shared/Container";
import TechnicianCard, {
  Technician,
} from "./TechnicianCard";

const topTechnicians: Technician[] = [
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    specialty: "Professional Electrician",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 142,
    experience: 8,
    startingPrice: 45,
    skills: [
      "Electrical",
      "Wiring",
      "Installation",
    ],
    verified: true,
  },
  {
    id: "michael-anderson",
    name: "Michael Anderson",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    specialty: "Expert Plumber",
    location: "Brooklyn, NY",
    rating: 4.8,
    reviewCount: 118,
    experience: 10,
    startingPrice: 40,
    skills: [
      "Plumbing",
      "Pipe Repair",
      "Water Systems",
    ],
    verified: true,
  },
  {
    id: "david-wilson",
    name: "David Wilson",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
    specialty: "Home Maintenance Pro",
    location: "Queens, NY",
    rating: 4.9,
    reviewCount: 96,
    experience: 7,
    startingPrice: 35,
    skills: [
      "Maintenance",
      "Carpentry",
      "Repairs",
    ],
    verified: true,
  },
];

export default function TechniciansSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-secondary/20 py-24 sm:py-28">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-100 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 size-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <Container>
        {/* Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <BadgeCheck className="size-3.5" />

              Trusted Professionals
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Meet the pros
              <span className="text-primary">
                {" "}
                behind the service.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Connect with experienced, verified technicians who
              are ready to help you get things done right.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
          >
            <Link
              href="/technicians"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Browse all technicians

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Technician Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topTechnicians.map((technician, index) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-xl"
        >
          <div className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Looking for a specific skill?
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Explore our complete network of verified professionals.
                </p>
              </div>
            </div>

            <Link
              href="/technicians"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Find Your Pro

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}