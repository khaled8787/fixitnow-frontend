
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Container from "@/components/shared/Container";
import TechnicianCard, {
  Technician,
} from "./TechnicianCard";
import api from "@/lib/axios";

/* ============================================================
   BACKEND TYPES
   ============================================================ */

interface BackendUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface BackendService {
  id?: string;
  title?: string | null;
  description?: string | null;
  price?: number | string | null;
  duration?: number | string | null;
  image?: string | null;
  isActive?: boolean;
}

interface BackendTechnician {
  id: string;

  user?: BackendUser | null;

  bio?: string | null;
  experience?: number | null;

  hourlyRate?: number | string | null;

  location?: string | null;

  isAvailable?: boolean;

  averageRating?: number | null;
  totalReviews?: number | null;

  services?: BackendService[];
}

interface TechniciansResponse {
  success?: boolean;
  message?: string;

  data?:
    | BackendTechnician[]
    | {
        data?: BackendTechnician[];
      };
}

/* ============================================================
   BACKEND ENDPOINT
   ============================================================ */

/**
 * app.use("/api", AppRoutes)
 *
 * AppRoutes:
 * /api/technicians
 *
 * Final URL:
 * /api/api/technicians
 */
const TECHNICIANS_ENDPOINT =
  "/api/api/technicians";

/* ============================================================
   HELPERS
   ============================================================ */

function getTechniciansFromResponse(
  response: TechniciansResponse
): BackendTechnician[] {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function formatHourlyRate(
  value: number | string | null | undefined
) {
  const rate = Number(value ?? 0);

  return Number.isFinite(rate) ? rate : 0;
}

function mapBackendTechnician(
  technician: BackendTechnician
): Technician {
  const user = technician.user;

  const services =
    technician.services?.filter(
      (service) => service?.title
    ) ?? [];

  /**
   * Active services only
   */
  const activeServices = services.filter(
    (service) => service.isActive !== false
  );

  /**
   * Skills come from the technician's
   * actual backend services.
   */
  const skills = activeServices
    .map((service) => service.title!.trim())
    .filter(Boolean)
    .slice(0, 3);

  /**
   * Specialty:
   *
   * First service title if available,
   * otherwise technician bio.
   */
  const specialty =
    activeServices[0]?.title?.trim() ||
    technician.bio?.trim() ||
    "Home Service Professional";

  /**
   * Starting price:
   *
   * Use the lowest active service price.
   *
   * If services don't contain a valid price,
   * fallback to technician hourly rate.
   */
  const servicePrices = activeServices
    .map((service) => Number(service.price))
    .filter(
      (price) =>
        Number.isFinite(price) && price > 0
    );

  const hourlyRate = formatHourlyRate(
    technician.hourlyRate
  );

  const startingPrice =
    servicePrices.length > 0
      ? Math.min(...servicePrices)
      : hourlyRate;

  /**
   * Backend technician profile itself
   * represents a verified professional.
   *
   * There is no separate "verified" field
   * in the provided backend schema.
   */
  const verified = true;

  return {
    id: technician.id,

    name:
      user?.name?.trim() ||
      "Professional Technician",

    image:
      user?.image ||
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",

    specialty,

    location:
      technician.location?.trim() ||
      "Location not specified",

    rating:
      Number(
        technician.averageRating ?? 0
      ) || 0,

    reviewCount:
      Number(
        technician.totalReviews ?? 0
      ) || 0,

    experience:
      Number(
        technician.experience ?? 0
      ) || 0,

    startingPrice,

    skills,

    verified,
  };
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function TechniciansSection() {
  const [technicians, setTechnicians] =
    useState<Technician[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTechnicians = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        /**
         * Backend supports:
         *
         * isAvailable=true
         *
         * We only show currently available
         * professionals on the homepage.
         */
        const response =
          await api.get<TechniciansResponse>(
            TECHNICIANS_ENDPOINT,
            {
              params: {
                isAvailable: true,
              },
            }
          );

        if (!isMounted) return;

        const backendTechnicians =
          getTechniciansFromResponse(
            response.data
          );

        const mappedTechnicians =
          backendTechnicians
            .filter(
              (technician) =>
                technician &&
                technician.id
            )
            .map(mapBackendTechnician);

        /**
         * Backend already orders by createdAt desc.
         *
         * Homepage only displays top 3.
         */
        setTechnicians(
          mappedTechnicians.slice(0, 3)
        );
      } catch (error) {
        console.error(
          "TECHNICIANS BACKEND ERROR:",
          error
        );

        if (!isMounted) return;

        setTechnicians([]);
        setHasError(true);

        toast.error(
          "Failed to load technicians"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTechnicians();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-secondary/20 py-24 sm:py-28">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-100 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 size-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <Container>
        {/* Header */}
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
              <BadgeCheck className="size-3.5" />

              Trusted Professionals
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Meet the pros
              <span className="text-primary">
                {" "}
                behind the service.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Connect with experienced, verified
              technicians who are ready to help
              you get things done right.
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
              href="/technicians"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Browse all technicians

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ====================================================
            LOADING
           ==================================================== */}

        {isLoading && (
          <div className="mt-12 flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />

              Loading technicians...
            </div>
          </div>
        )}

        {/* ====================================================
            ERROR
           ==================================================== */}

        {!isLoading && hasError && (
          <div className="mt-12 flex min-h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Unable to load technicians
                right now.
              </p>

              <Link
                href="/technicians"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Browse all technicians

                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ====================================================
            EMPTY
           ==================================================== */}

        {!isLoading &&
          !hasError &&
          technicians.length === 0 && (
            <div className="mt-12 flex min-h-60 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No technicians are available
                  right now.
                </p>

                <Link
                  href="/technicians"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Find a technician

                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

        {/* ====================================================
            TECHNICIAN GRID
           ==================================================== */}

        {!isLoading &&
          !hasError &&
          technicians.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {technicians.map(
                (technician, index) => (
                  <TechnicianCard
                    key={technician.id}
                    technician={technician}
                    index={index}
                  />
                )
              )}
            </div>
          )}

        {/* ====================================================
            BOTTOM TRUST BANNER
           ==================================================== */}

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
            duration: 0.6,
            delay: 0.2,
          }}
          className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-xl"
        >
          <div className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Looking for a specific skill?
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Explore our complete network of
                  verified professionals.
                </p>
              </div>
            </div>

            <Link
              href="/technicians"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Find Your Pro

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
