
"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import BookingFlow from "@/components/booking/BookingFlow";
import TechnicianSelection from "@/components/technicians/TechnicianSelection";

import {
  getTechnicians,
  type TechnicianApiResponse,
} from "@/services/technician.service";

import type { Service } from "@/types/service";
import type { Technician } from "@/types/technician";

interface ServiceDetailsClientProps {
  service: Service;
}

function mapTechnician(
  technician: TechnicianApiResponse,
): Technician {
  return {
    // IMPORTANT:
    // This is TechnicianProfile.id from backend.
    // Booking API needs this ID as technicianId.
    id: technician.id,

    userId: technician.userId,

    name: technician.user?.name ?? "Unknown Technician",

    email: technician.user?.email ?? "",

    phone: technician.user?.phone ?? null,

    image: technician.user?.image ?? "",

    bio: technician.bio ?? "",

    location: technician.location ?? "",

    experience: Number(technician.experience ?? 0),

    hourlyRate: Number(technician.hourlyRate ?? 0),

    isAvailable: Boolean(technician.isAvailable),

    // Backend currently does not provide these fields.
    rating: 0,
    reviewCount: 0,
    completedJobs: 0,

    services:
      technician.services?.map((service) => ({
        id: service.id,
        title: service.title,
        name: service.name,
        description: service.description,
        price:
          service.price !== undefined
            ? Number(service.price)
            : undefined,
        image: service.image,
      })) ?? [],
  };
}

export default function ServiceDetailsClient({
  service,
}: ServiceDetailsClientProps) {
  const [technicians, setTechnicians] = useState<Technician[]>(
    [],
  );

  const [selectedTechnicianId, setSelectedTechnicianId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadTechnicians() {
      try {
        setIsLoading(true);

        const response = await getTechnicians({
          isAvailable: true,
        });

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const mappedTechnicians = data.map(mapTechnician);

        if (!mounted) {
          return;
        }

        setTechnicians(mappedTechnicians);

        setSelectedTechnicianId((currentId) => {
          if (!currentId) {
            return null;
          }

          const exists = mappedTechnicians.some(
            (technician) =>
              technician.id === currentId,
          );

          return exists ? currentId : null;
        });
      } catch (error: any) {
        console.error(
          "TECHNICIANS API ERROR:",
          error?.response?.data ?? error,
        );

        if (!mounted) {
          return;
        }

        toast.error(
          error?.response?.data?.message ??
            "Failed to load technicians.",
        );

        setTechnicians([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadTechnicians();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedTechnician = useMemo(() => {
    if (!selectedTechnicianId) {
      return null;
    }

    return (
      technicians.find(
        (technician) =>
          technician.id === selectedTechnicianId,
      ) ?? null
    );
  }, [technicians, selectedTechnicianId]);

  if (isLoading) {
    return (
      <section className="mt-12 border-t border-border/60 pt-12">
        <div className="flex min-h-48 items-center justify-center rounded-3xl border border-border/70 bg-background">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />

            Loading available technicians...
          </div>
        </div>
      </section>
    );
  }

  return (
  <div id="technician-booking">
    <TechnicianSelection
        technicians={technicians}
        selectedTechnicianId={selectedTechnicianId}
        onSelectTechnician={setSelectedTechnicianId}
      />

      {selectedTechnician && (
        <BookingFlow
          technician={selectedTechnician}
          serviceId={service.id}
          serviceName={service.title}
        />
      )}
    </div>
  );
}
