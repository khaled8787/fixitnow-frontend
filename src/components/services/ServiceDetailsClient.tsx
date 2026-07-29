"use client";

import { useMemo, useState } from "react";

import BookingFlow from "@/components/booking/BookingFlow";
import TechnicianSelection from "@/components/technicians/TechnicianSelection";
import { technicians } from "@/data/technicians";
import type { Service } from "@/types/service";

interface ServiceDetailsClientProps {
  service: Service;
}

export default function ServiceDetailsClient({
  service,
}: ServiceDetailsClientProps) {
  const [selectedTechnicianId, setSelectedTechnicianId] =
    useState<string | null>(null);

  const selectedTechnician = useMemo(() => {
    return (
      technicians.find(
        (item) => item.id === selectedTechnicianId
      ) ?? null
    );
  }, [selectedTechnicianId]);

  return (
    <>
      <TechnicianSelection
        selectedTechnicianId={selectedTechnicianId}
        onSelectTechnician={setSelectedTechnicianId}
      />

      {selectedTechnician && (
        <BookingFlow
          technician={selectedTechnician}
          serviceName={service.title}
        />
      )}
    </>
  );
}