
import type { Technician } from "@/types/technician";

export const technicians: Technician[] = [
  {
    id: "tech-001",
    userId: "user-001",
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    bio: "Experienced home service professional focused on reliable and high-quality work.",
    location: "Dhaka, Bangladesh",
    experience: 8,
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 25,
    completedJobs: 342,
    isAvailable: true,
  },
  {
    id: "tech-002",
    userId: "user-002",
    name: "Karim Hasan",
    email: "karim@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    bio: "Professional technician with years of experience delivering dependable home services.",
    location: "Dhaka, Bangladesh",
    experience: 6,
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 22,
    completedJobs: 267,
    isAvailable: true,
  },
  {
    id: "tech-003",
    userId: "user-003",
    name: "Sabbir Hossain",
    email: "sabbir@example.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Dedicated service professional committed to making every customer experience smooth and stress-free.",
    location: "Chattogram, Bangladesh",
    experience: 5,
    rating: 4.7,
    reviewCount: 76,
    hourlyRate: 20,
    completedJobs: 189,
    isAvailable: true,
  },
  {
    id: "tech-004",
    userId: "user-004",
    name: "Tanvir Rahman",
    email: "tanvir@example.com",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    bio: "Friendly and experienced professional providing efficient and detail-oriented home services.",
    location: "Rajshahi, Bangladesh",
    experience: 7,
    rating: 4.6,
    reviewCount: 64,
    hourlyRate: 18,
    completedJobs: 214,
    isAvailable: false,
  },
];
