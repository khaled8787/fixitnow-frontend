
export interface Technician {
  id: string;
  userId: string;

  name: string;
  email: string;
  phone?: string | null;
  image: string;

  bio: string;
  location: string;
  experience: number;
  hourlyRate: number;

  isAvailable: boolean;

  services?: {
    id: string;
    title?: string;
    name?: string;
    description?: string | null;
    price?: number;
    image?: string | null;
  }[];
}
