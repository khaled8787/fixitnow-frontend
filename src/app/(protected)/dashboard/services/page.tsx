
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Clock3,
  Edit3,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  Wrench,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface Technician {
  id: string;
  userId: string;
  bio?: string | null;
  experience?: number;
  hourlyRate?: string | number;
  location?: string;
  averageRating?: number;
  totalReviews?: number;
  isAvailable?: boolean;
}

interface Service {
  id: string;
  technicianId: string;
  categoryId: string;
  title: string;
  description: string;
  price: string | number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  technician?: Technician | null;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [deleteServiceId, setDeleteServiceId] =
    useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const loadServices = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const response = await api.get<
          ApiResponse<Service[]>
        >("/api/api/services");

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          setServices([]);

          toast.error(
            "Invalid services response from the backend.",
          );

          return;
        }

        setServices(data);
      } catch (error: any) {
        console.error("LOAD SERVICES ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load your services.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  /*
   * ------------------------------------------------------------
   * Confirmed Delete
   * ------------------------------------------------------------
   */
  const handleDelete = async () => {
    if (!deleteServiceId) {
      return;
    }

    try {
      setIsDeleting(true);

      await api.delete(
        `/api/api/services/${deleteServiceId}`,
      );

      toast.success(
        "Service deleted successfully.",
      );

      setDeleteServiceId(null);

      await loadServices();
    } catch (error: any) {
      console.error(
        "DELETE SERVICE ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete service.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = services.filter(
    (service) => service.isActive,
  ).length;

  const inactiveCount = services.filter(
    (service) => !service.isActive,
  ).length;

  const selectedService = services.find(
    (service) => service.id === deleteServiceId,
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wrench className="size-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-primary">
                  Technician Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  My Services
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Manage the services you offer to FixItNow
                  customers.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadServices(true)}
                disabled={isLoading || isRefreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`size-4 ${
                    isRefreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

              <Link
                href="/dashboard/services/create"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <Plus className="size-4" />
                Create Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Services"
              value={services.length}
              icon={
                <Wrench className="size-5" />
              }
            />

            <StatCard
              label="Active Services"
              value={activeCount}
              icon={
                <Eye className="size-5" />
              }
            />

            <StatCard
              label="Inactive Services"
              value={inactiveCount}
              icon={
                <AlertCircle className="size-5" />
              }
            />
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-border/60 bg-background">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Loading your services...
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Please wait while we fetch your services
                    from the backend.
                  </p>
                </div>
              </div>
            </div>
          ) : services.length === 0 ? (
            /* Empty */
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wrench className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No services found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                You have not created any services yet.
                Create your first service so customers can
                discover and book it.
              </p>

              <Link
                href="/dashboard/services/create"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <Plus className="size-4" />
                Create Your First Service
              </Link>
            </div>
          ) : (
            /* Service Grid */
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isDeleting={
                    isDeleting &&
                    deleteServiceId === service.id
                  }
                  onDelete={() =>
                    setDeleteServiceId(
                      service.id,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteServiceId && selectedService && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isDeleting
            ) {
              setDeleteServiceId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-6" />
                </div>

                <div>
                  <h2
                    id="delete-service-title"
                    className="text-lg font-bold"
                  >
                    Delete Service?
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteServiceId(null)
                }
                disabled={isDeleting}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Service to delete
                </p>

                <p className="mt-2 text-base font-bold">
                  {selectedService.title}
                </p>

                {selectedService.category?.name && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Tag className="size-3.5" />
                    {selectedService.category.name}
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {selectedService.title}
                </span>
                ? Customers will no longer be able to access
                this service.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/20 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteServiceId(null)
                }
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-5 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Delete Service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  isDeleting,
  onDelete,
}: {
  service: Service;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  const price = Number(service.price);

  return (
    <article className="group overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Card Top */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/10 via-muted/40 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,120,120,0.15),transparent_55%)]" />

        <div className="absolute left-5 top-5 flex size-12 items-center justify-center rounded-2xl bg-background/90 text-primary shadow-sm backdrop-blur">
          <Wrench className="size-6" />
        </div>

        <div className="absolute right-5 top-5">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              service.isActive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {service.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-lg font-bold tracking-tight">
              {service.title}
            </h2>

            {service.category?.name && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                <Tag className="size-3.5" />
                {service.category.name}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xl font-bold">
              {Number.isFinite(price)
                ? `$${price.toFixed(2)}`
                : "$0.00"}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>

        {/* Meta */}
        <div className="mt-5 flex items-center gap-4 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-4 text-primary" />
            {service.duration} min
          </div>

          {service.category?.name && (
            <div className="truncate text-xs text-muted-foreground">
              {service.category.name}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <Eye className="size-4" />
            View
          </Link>

          <Link
            href={`/dashboard/services/${service.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Edit3 className="size-4" />
            Edit
          </Link>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="size-4" />
          Delete Service
        </button>
      </div>
    </article>
  );
}
