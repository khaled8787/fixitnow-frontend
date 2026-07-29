"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";


import { technicians } from "@/data/technicians";
interface TechnicianSelectionProps {
  selectedTechnicianId: string | null;
  onSelectTechnician: (id: string) => void;
}

export default function TechnicianSelection({
  selectedTechnicianId,
  onSelectTechnician,
}: TechnicianSelectionProps) {
  

  return (
    <section className="mt-12 border-t border-border/60 pt-12">
      {/* Section Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Choose your technician
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Select a trusted professional based on their
              experience, ratings, and availability.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary sm:flex">
            <ShieldCheck className="size-4" />

            Verified professionals
          </div>
        </div>
      </div>

      {/* Technician Cards */}
      <div className="mt-8 grid gap-5">
        {technicians.map((technician) => {
          const isSelected =
  selectedTechnicianId === technician.id;

          return (
            <div
              key={technician.id}
              className={`group relative overflow-hidden rounded-3xl border bg-background transition-all duration-300 ${
                isSelected
                  ? "border-primary/50 shadow-lg shadow-primary/10"
                  : "border-border/70 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-black/5"
              }`}
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                {/* Image */}
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-28">
                  <Image
                    src={technician.image}
                    alt={technician.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="112px"
                  />

                  {technician.isAvailable && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                      <span className="size-1.5 rounded-full bg-emerald-400" />

                      Available
                    </div>
                  )}
                </div>

                {/* Main Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold tracking-tight">
                      {technician.name}
                    </h3>

                    <ShieldCheck className="size-4 text-primary" />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />

                      {technician.location}
                    </span>

                    <span>
                      {technician.experience}+ years experience
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      <Star className="size-4 fill-amber-500 text-amber-500" />

                      {technician.rating.toFixed(1)}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {technician.reviewCount} reviews
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {technician.completedJobs} jobs completed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:w-[170px]">
                  {/* View Profile */}
                  <Link
                    href={`/technicians/${technician.id}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    View Profile

                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>

                  {/* Select Technician */}
                  <button
                    type="button"
                    onClick={() =>
                     onSelectTechnician(technician.id)
                    }
                    className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    {isSelected && (
                      <Check className="size-4" />
                    )}

                    {isSelected
                      ? "Selected"
                      : "Select Technician"}
                  </button>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Technician Message */}
      {selectedTechnicianId && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" />
          </div>

          <p className="text-sm text-muted-foreground">
            Technician selected. You can now continue with
            the booking process below.
          </p>
        </div>
      )}
    </section>
  );
}