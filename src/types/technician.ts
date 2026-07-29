export interface Technician {
  id: string;
  name: string;
  image: string;
  bio: string;
  location: string;
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  skills: string[];
  completedJobs: number;
  isAvailable: boolean;
}