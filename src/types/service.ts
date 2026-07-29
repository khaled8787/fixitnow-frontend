export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;

  duration?: string;
  featured?: boolean;
}