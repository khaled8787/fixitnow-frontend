"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Users,
} from "lucide-react";

import TechnicianCard from "@/components/technicians/TechnicianCard";
import { technicians } from "@/data/technicians";
import type { Technician } from "@/types/technician";

export default function TechnicianSelection() {
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Users className="size-5" />

            <span className="text-sm font-semibold">
              Trusted professionals
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Choose your technician
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Select a verified professional based on
            experience, ratings, reviews, and availability.
          </p>
        </div>

        {/* Selection Status */}
        {selectedTechnician && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" />

            {selectedTechnician.name} selected
          </div>
        )}
      </div>

      {/* Technician Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            isSelected={
              selectedTechnician?.id === technician.id
            }
            onSelect={setSelectedTechnician}
          />
        ))}
      </div>
    </section>
  );
}