export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface BookingSelection {
  serviceId: string;
  serviceName: string;
  technicianId: string;
  technicianName: string;
  date: string;
  timeSlot: TimeSlot | null;
}