"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Star,
} from "lucide-react";

import type { Technician } from "@/types/technician";

interface TechnicianCardProps {
  technician: Technician;
  isSelected?: boolean;
  onSelect?: (technician: Technician) => void;
}

export default function TechnicianCard({
  technician,
  isSelected = false,
  onSelect,
}: TechnicianCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border bg-background transition-all duration-500 ${
        isSelected
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-border/60 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
      }`}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <CheckCircle2 className="size-5" />
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={technician.image}
          alt={technician.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Availability */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md ${
              technician.isAvailable
                ? "bg-emerald-500/70"
                : "bg-black/40"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                technician.isAvailable
                  ? "bg-white"
                  : "bg-white/50"
              }`}
            />

            {technician.isAvailable
              ? "Available now"
              : "Currently unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold tracking-tight">
                {technician.name}
              </h3>

              <CheckCircle2 className="size-4 shrink-0 text-primary" />
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />

              {technician.location}
            </div>
          </div>

          {/* Rating */}
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Star className="size-3.5 fill-current" />

            {technician.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {technician.bio}
        </p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BriefcaseBusiness className="size-4" />

              <span className="text-xs">
                Experience
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              {technician.experience}+ years
            </p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="size-4" />

              <span className="text-xs">
                Reviews
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              {technician.reviewCount}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-xs text-muted-foreground">
              From
            </span>

            <p className="mt-0.5 text-lg font-bold">
              ${technician.hourlyRate}
              <span className="text-xs font-normal text-muted-foreground">
                /hr
              </span>
            </p>
          </div>

          {onSelect ? (
            <button
              type="button"
              disabled={!technician.isAvailable}
              onClick={() => onSelect(technician)}
              className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 ${
                technician.isAvailable
                  ? isSelected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              {isSelected
                ? "Selected"
                : technician.isAvailable
                  ? "Select"
                  : "Unavailable"}

              {technician.isAvailable && (
                <ArrowUpRight className="size-4" />
              )}
            </button>
          ) : (
            <Link
              href={`/technicians/${technician.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              View Profile

              <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}