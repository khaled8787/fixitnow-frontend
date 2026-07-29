"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/shared/Container";
import ServiceCard, {
  Service,
} from "./ServiceCard";

const featuredServices: Service[] = [
  {
    id: "home-cleaning",
    name: "Home Cleaning",
    description:
      "Professional cleaning services to keep your home fresh, healthy, and spotless.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    category: "Cleaning",
    rating: 4.9,
    reviewCount: 128,
    startingPrice: 25,
    duration: "2-3 hrs",
  },
  {
    id: "plumbing-repair",
    name: "Plumbing Repair",
    description:
      "Get reliable plumbing solutions from experienced professionals for every repair.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
    category: "Plumbing",
    rating: 4.8,
    reviewCount: 96,
    startingPrice: 35,
    duration: "1-2 hrs",
  },
  {
    id: "electrical-service",
    name: "Electrical Service",
    description:
      "Safe and dependable electrical installation, maintenance, and repair services.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    category: "Electrical",
    rating: 4.9,
    reviewCount: 87,
    startingPrice: 40,
    duration: "1-3 hrs",
  },
  {
    id: "ac-repair",
    name: "AC Repair & Service",
    description:
      "Keep your home comfortable with fast AC maintenance and professional repair.",
    image:
      "https://images.unsplash.com/photo-1631545806609-5d3d7e2b9e89?auto=format&fit=crop&w=900&q=80",
    category: "AC & Cooling",
    rating: 4.7,
    reviewCount: 74,
    startingPrice: 30,
    duration: "1-2 hrs",
  },
  {
    id: "painting",
    name: "Home Painting",
    description:
      "Transform your space with high-quality painting from skilled professionals.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80",
    category: "Painting",
    rating: 4.8,
    reviewCount: 63,
    startingPrice: 50,
    duration: "4-6 hrs",
  },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    description:
      "Expert repair services for your essential home appliances, big or small.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    category: "Appliances",
    rating: 4.6,
    reviewCount: 51,
    startingPrice: 30,
    duration: "1-2 hrs",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />

              Popular Services
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Everything your home needs,
              <span className="text-primary">
                {" "}
                in one place.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              From everyday maintenance to unexpected repairs, find
              skilled professionals ready to get the job done right.
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
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View all services

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}