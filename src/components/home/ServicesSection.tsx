
"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Container from "@/components/shared/Container";
import ServiceCard, {
  Service,
} from "./ServiceCard";
import api from "@/lib/axios";

interface BackendCategory {
  id?: string;
  name?: string;
  title?: string;
}

interface BackendTechnician {
  id?: string;
  averageRating?: number;
  totalReviews?: number;
  user?: {
    id?: string;
    name?: string;
    image?: string | null;
  };
}

interface BackendService {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  price?: number | string;
  duration?: string | number;
  isActive?: boolean;

  category?: BackendCategory | null;
  technician?: BackendTechnician | null;

  averageRating?: number;
  totalReviews?: number;
  rating?: number;
  reviewCount?: number;
}

interface ServicesResponse {
  success?: boolean;
  message?: string;
  data?:
    | BackendService[]
    | {
        data?: BackendService[];
      };
}

/**
 * Backend returns:
 *
 * GET /api/api/services
 *
 * because:
 *
 * app.use("/api", AppRoutes)
 * +
 * AppRoutes -> "/api/services"
 *
 * Final URL:
 * /api/api/services
 */
const SERVICES_ENDPOINT = "/api/api/services";

function getServicesFromResponse(
  response: ServicesResponse
): BackendService[] {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function mapBackendService(
  service: BackendService
): Service {
  const rating =
    Number(
      service.averageRating ??
        service.rating ??
        service.technician?.averageRating ??
        0
    ) || 0;

  const reviewCount =
    Number(
      service.totalReviews ??
        service.reviewCount ??
        service.technician?.totalReviews ??
        0
    ) || 0;

  const price =
    Number(service.price ?? 0) || 0;

  const category =
    service.category?.name ??
    service.category?.title ??
    "Home Services";

  const duration =
    service.duration !== undefined &&
    service.duration !== null
      ? String(service.duration)
      : "1-2 hrs";

  return {
    id: service.id,
    name: service.title,
    description: service.description,
    image:
      service.image ||
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    category,
    rating,
    reviewCount,
    startingPrice: price,
    duration,
  };
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response =
          await api.get<ServicesResponse>(
            SERVICES_ENDPOINT,
            {
              params: {
                isActive: true,
              },
            }
          );

        if (!isMounted) return;

        const backendServices =
          getServicesFromResponse(
            response.data
          );

        const mappedServices =
          backendServices
            .filter(
              (service) =>
                service &&
                service.id &&
                service.title
            )
            .map(mapBackendService);

        /**
         * Homepage shows featured services.
         * Backend already sorts by createdAt desc.
         * We simply take the first 6.
         */
        setServices(
          mappedServices.slice(0, 6)
        );
      } catch (error) {
        console.error(
          "SERVICES BACKEND ERROR:",
          error
        );

        if (!isMounted) return;

        setServices([]);
        setHasError(true);

        toast.error(
          "Failed to load services"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />

              Popular Services
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Everything your home needs,
              <span className="text-primary">
                {" "}
                in one place.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              From everyday maintenance to
              unexpected repairs, find skilled
              professionals ready to get the job
              done right.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View all services

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />

              Loading services...
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="mt-12 flex min-h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Unable to load services right now.
              </p>

              <Link
                href="/services"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Browse all services
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !hasError &&
          services.length === 0 && (
            <div className="mt-12 flex min-h-60 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No services are available right now.
                </p>

                <Link
                  href="/services"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  View all services
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

        {/* Services Grid */}
        {!isLoading &&
          !hasError &&
          services.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(
                (service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                  />
                )
              )}
            </div>
          )}
      </Container>
    </section>
  );
}
