import type { TimeSlot } from "@/types/booking";

export const timeSlots: TimeSlot[] = [
  {
    id: "slot-1",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    isAvailable: true,
  },
  {
    id: "slot-2",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    isAvailable: true,
  },
  {
    id: "slot-3",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    isAvailable: false,
  },
  {
    id: "slot-4",
    startTime: "12:00 PM",
    endTime: "01:00 PM",
    isAvailable: true,
  },
  {
    id: "slot-5",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    isAvailable: true,
  },
  {
    id: "slot-6",
    startTime: "03:00 PM",
    endTime: "04:00 PM",
    isAvailable: false,
  },
  {
    id: "slot-7",
    startTime: "04:00 PM",
    endTime: "05:00 PM",
    isAvailable: true,
  },
  {
    id: "slot-8",
    startTime: "05:00 PM",
    endTime: "06:00 PM",
    isAvailable: true,
  },
];