"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { timeSlots } from "@/data/availability";
import type { TimeSlot } from "@/types/booking";
import type { Technician } from "@/types/technician";

interface BookingFlowProps {
  technician: Technician;
  serviceName?: string;
}

export default function BookingFlow({
  technician,
  serviceName,
}: BookingFlowProps) {
  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState<TimeSlot | null>(null);

  const [isConfirmed, setIsConfirmed] =
    useState(false);

  const formattedDate = useMemo(() => {
    if (!selectedDate) {
      return "";
    }

    const date = new Date(
      `${selectedDate}T00:00:00`,
    );

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const canConfirm =
    Boolean(selectedDate) &&
    Boolean(selectedSlot);

  function handleConfirmBooking() {
    if (!canConfirm) {
      return;
    }

    setIsConfirmed(true);
  }

  if (isConfirmed) {
    return (
      <section className="mt-10 overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.03]">
        <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-9" />
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Booking request ready!
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            Your booking request has been prepared successfully.
            Once the technician accepts your request, you can
            continue to the secure payment process.
          </p>

          <div className="mt-8 w-full max-w-md rounded-2xl border border-border/60 bg-background p-5 text-left">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Technician
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {technician.name}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <CalendarDays className="size-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Appointment
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formattedDate}
                </p>
              </div>
            </div>

            {selectedSlot && (
              <div className="mt-5 flex items-center gap-3">
                <Clock3 className="size-5 text-primary" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Time slot
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedSlot.startTime} -{" "}
                    {selectedSlot.endTime}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmed(false)}
            className="mt-7 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Change booking details
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-border/70 bg-background shadow-xl shadow-black/5">
      {/* Header */}
      <div className="border-b border-border/60 bg-muted/20 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Book your appointment
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Choose a convenient date and available time slot.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Technician Summary */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Booking with
              </p>

              <div className="mt-1 flex items-center gap-2">
                <p className="font-semibold">
                  {technician.name}
                </p>

                <ShieldCheck className="size-4 text-primary" />
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />

                {technician.location}
              </div>
            </div>

            {serviceName && (
              <div className="rounded-xl bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Service
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {serviceName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                1. Select a date
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose your preferred appointment date.
              </p>
            </div>
          </div>

          <div className="relative mt-4 max-w-md">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="date"
              value={selectedDate}
              min={new Date()
                .toISOString()
                .split("T")[0]}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedSlot(null);
              }}
              className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="mt-8">
          <div>
            <h3 className="font-semibold">
              2. Select an available time
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {selectedDate
                ? "Available time slots for your selected date."
                : "Select a date first to see available slots."}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {timeSlots.map((slot) => {
              const isSelected =
                selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={
                    !selectedDate ||
                    !slot.isAvailable
                  }
                  onClick={() =>
                    setSelectedSlot(slot)
                  }
                  className={`relative rounded-xl border px-3 py-3 text-left transition-all duration-300 ${
                    !selectedDate ||
                    !slot.isAvailable
                      ? "cursor-not-allowed border-border/40 bg-muted/30 opacity-50"
                      : isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}

                  <Clock3 className="size-4" />

                  <p className="mt-2 text-xs font-semibold">
                    {slot.startTime}
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    to {slot.endTime}
                  </p>

                  <p
                    className={`mt-2 text-[10px] font-medium ${
                      slot.isAvailable
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {slot.isAvailable
                      ? "Available"
                      : "Booked"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-5">
          <h3 className="font-semibold">
            Booking summary
          </h3>

          <div className="mt-5 space-y-4">
            <SummaryRow
              label="Technician"
              value={technician.name}
            />

            {serviceName && (
              <SummaryRow
                label="Service"
                value={serviceName}
              />
            )}

            <SummaryRow
              label="Date"
              value={
                formattedDate || "Not selected"
              }
            />

            <SummaryRow
              label="Time"
              value={
                selectedSlot
                  ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                  : "Not selected"
              }
            />
          </div>
        </div>

        {/* Confirm */}
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirmBooking}
          className={`mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all duration-300 ${
            canConfirm
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          <CheckCircle2 className="size-4" />

          Confirm Booking Request
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Your booking request will be sent to the technician.
          Payment will only be required after acceptance.
        </p>
      </div>
    </section>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}