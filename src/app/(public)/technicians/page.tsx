"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Search,
  Star,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

/* ============================================================
   Types
============================================================ */

interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

interface TechnicianService {
  id: string;
  title: string;
  price?: string | number;
}

interface Technician {
  id: string;
  userId: string;
  bio?: string | null;
  location?: string | null;
  experience?: number | null;
  skills?: string[] | null;
  isAvailable: boolean;
  rating?: number | string | null;
  totalReviews?: number | null;
  user?: TechnicianUser | null;
  services?: TechnicianService[];
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* ============================================================
   Page
============================================================ */

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const [availability, setAvailability] = useState<
    "ALL" | "AVAILABLE" | "UNAVAILABLE"
  >("ALL");

  /* ============================================================
     Load Technicians
  ============================================================ */

  const loadTechnicians = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const params = new URLSearchParams();

        if (searchTerm.trim()) {
          params.set("searchTerm", searchTerm.trim());
        }

        if (location.trim()) {
          params.set("location", location.trim());
        }

        if (availability !== "ALL") {
          params.set(
            "isAvailable",
            availability === "AVAILABLE" ? "true" : "false",
          );
        }

        const query = params.toString();

        const response = await api.get<ApiResponse<Technician[]>>(
          `/api/api/technicians${query ? `?${query}` : ""}`,
        );

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          setTechnicians([]);

          toast.error("Invalid technician response from the backend.");

          return;
        }

        setTechnicians(data);
      } catch (error: any) {
        console.error("LOAD TECHNICIANS ERROR:", error);

        setTechnicians([]);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load technicians.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchTerm, location, availability],
  );

  

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  
  const visibleTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      if (availability === "AVAILABLE" && !technician.isAvailable) {
        return false;
      }

      if (
        availability === "UNAVAILABLE" &&
        technician.isAvailable
      ) {
        return false;
      }

      return true;
    });
  }, [technicians, availability]);

  

  const handleSearch = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await loadTechnicians();
  };

 

  const handleClearFilters = async () => {
    setSearchTerm("");
    setLocation("");
    setAvailability("ALL");
  };

  
  return (
    <main className="min-h-screen bg-background">
      

      <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Users className="size-7" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Trusted Professionals
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find the Right
              <span className="block text-primary">
                Technician
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Browse skilled technicians, explore their expertise,
              check availability, and choose the right professional
              for your home service needs.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          Main
      ======================================================= */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ==================================================
              Search & Filters
          =================================================== */}

          <div className="mb-10 rounded-3xl border border-border/60 bg-background p-5 shadow-sm sm:p-6">
            <form
              onSubmit={handleSearch}
              className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]"
            >
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search technicians..."
                  className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Search by location..."
                  className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="size-4" />
                Search
              </button>
            </form>

            {/* Availability */}
            <div className="mt-5 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Availability
                </span>

                {(
                  [
                    ["ALL", "All"],
                    ["AVAILABLE", "Available Now"],
                    ["UNAVAILABLE", "Unavailable"],
                  ] as const
                ).map(([value, label]) => {
                  const active = availability === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAvailability(value)
                      }
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  onClick={() => loadTechnicians(true)}
                  disabled={isLoading || isRefreshing}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    className={`size-3.5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              Result Header
          =================================================== */}

          {!isLoading && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing
                </p>

                <h2 className="text-xl font-bold">
                  {visibleTechnicians.length}{" "}
                  {visibleTechnicians.length === 1
                    ? "Technician"
                    : "Technicians"}
                </h2>
              </div>
            </div>
          )}

          {/* ==================================================
              Loading
          =================================================== */}

          {isLoading ? (
            <TechnicianLoadingGrid />
          ) : visibleTechnicians.length === 0 ? (
            /* ==================================================
               Empty
            =================================================== */

            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No technicians found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We couldn't find any technicians matching your
                current search or filters. Try changing your
                search criteria.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* ==================================================
               Technician Grid
            =================================================== */

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTechnicians.map((technician) => (
                <TechnicianCard
                  key={technician.id}
                  technician={technician}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   Technician Card
============================================================ */

function TechnicianCard({
  technician,
}: {
  technician: Technician;
}) {
  const user = technician.user;

  const rating =
    technician.rating !== null &&
    technician.rating !== undefined
      ? Number(technician.rating)
      : null;

  const skills = Array.isArray(technician.skills)
    ? technician.skills
    : [];

  const serviceCount = Array.isArray(technician.services)
    ? technician.services.length
    : 0;

  return (
    <article className="group overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ======================================================
          Card Top
      ======================================================= */}

      <div className="relative border-b border-border/60 bg-muted/20 p-6">
        <div className="absolute right-5 top-5">
          {technician.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
              <span className="size-1.5 rounded-full bg-muted-foreground" />
              Unavailable
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary ring-4 ring-background">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "Technician"}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <User className="size-9" />
          )}
        </div>

        {/* Name */}
        <div className="mt-5 pr-20">
          <h3 className="truncate text-lg font-bold">
            {user?.name || "Professional Technician"}
          </h3>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user?.email || "Verified service professional"}
          </p>
        </div>
      </div>

      {/* ======================================================
          Card Body
      ======================================================= */}

      <div className="space-y-5 p-6">
        {/* Location */}
        {technician.location && (
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </p>

              <p className="mt-1 truncate text-sm font-semibold">
                {technician.location}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BriefcaseBusiness className="size-4" />

              <span className="text-[11px] font-medium">
                Experience
              </span>
            </div>

            <p className="mt-2 text-sm font-bold">
              {technician.experience !== null &&
              technician.experience !== undefined
                ? `${technician.experience} ${
                    technician.experience === 1
                      ? "year"
                      : "years"
                  }`
                : "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="size-4" />

              <span className="text-[11px] font-medium">
                Rating
              </span>
            </div>

            <p className="mt-2 flex items-center gap-1 text-sm font-bold">
              {rating !== null && Number.isFinite(rating)
                ? rating.toFixed(1)
                : "New"}

              {rating !== null &&
                Number.isFinite(rating) && (
                  <Star className="size-3.5 fill-current text-amber-500" />
                )}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="size-4" />

            <span className="text-xs font-medium">
              Services
            </span>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {serviceCount}
          </span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {skill}
                </span>
              ))}

              {skills.length > 3 && (
                <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {technician.bio && (
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {technician.bio}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/technicians/${technician.id}`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
        >
          View Technician
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ============================================================
   Loading Skeleton
============================================================ */

function TechnicianLoadingGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border/60 bg-background"
        >
          <div className="animate-pulse border-b border-border/60 bg-muted/30 p-6">
            <div className="size-20 rounded-2xl bg-muted" />

            <div className="mt-5 h-5 w-40 rounded-lg bg-muted" />

            <div className="mt-2 h-3 w-52 rounded-lg bg-muted" />
          </div>

          <div className="space-y-5 p-6">
            <div className="h-10 rounded-xl bg-muted" />

            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-2xl bg-muted" />
              <div className="h-20 rounded-2xl bg-muted" />
            </div>

            <div className="h-8 rounded-xl bg-muted" />

            <div className="h-11 rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}