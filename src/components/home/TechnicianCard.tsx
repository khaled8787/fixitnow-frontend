"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export interface Technician {
  id: string;
  name: string;
  image: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  experience: number;
  startingPrice: number;
  skills: string[];
  verified: boolean;
}

interface TechnicianCardProps {
  technician: Technician;
  index?: number;
}

export default function TechnicianCard({
  technician,
  index = 0,
}: TechnicianCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Profile Image */}
      <Link
        href={`/technicians/${technician.id}`}
        className="relative block aspect-4/3 overflow-hidden"
      >
        <Image
          src={technician.image}
          alt={technician.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* Verified Badge */}
        {technician.verified && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <BadgeCheck className="size-3.5 text-primary" />
            Verified Pro
          </div>
        )}

        {/* Profile Arrow */}
        <div className="absolute right-4 top-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold tracking-tight text-white">
            {technician.name}
          </h3>

          <p className="mt-1 text-sm text-white/75">
            {technician.specialty}
          </p>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Rating & Location */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold">
              {technician.rating.toFixed(1)}
            </span>

            <span className="text-xs text-muted-foreground">
              ({technician.reviewCount} reviews)
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />

            <span className="truncate">
              {technician.location}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {technician.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {technician.experience}+ years experience
            </p>

            <p className="mt-1 text-lg font-bold tracking-tight">
              From ${technician.startingPrice}
            </p>
          </div>

          <Link
            href={`/technicians/${technician.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Profile

            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}