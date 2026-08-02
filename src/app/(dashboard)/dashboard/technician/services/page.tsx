"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Plus,
  RefreshCw,
  Settings2,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import {
  deleteService,
  getServices,
  type ServiceApiResponse,
} from "@/services/service.service";

import ServiceForm from "@/components/dashboard/technician/ServiceForm";

export default function TechnicianServicesPage() {
  const [services, setServices] =
    useState<ServiceApiResponse[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingService, setEditingService] =
    useState<ServiceApiResponse | null>(
      null,
    );

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  async function loadServices() {
    try {
      setIsLoading(true);

      /*
       * Backend currently returns all services.
       *
       * Ideally your backend should filter by
       * authenticated technician. If it already
       * does that internally, this is perfect.
       */
      const response =
        await getServices();

      const data = Array.isArray(
        response?.data,
      )
        ? response.data
        : [];

      setServices(data);
    } catch (error: any) {
      console.error(
        "TECHNICIAN SERVICES ERROR:",
        error?.response?.data ?? error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to load services.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleCreate() {
    setEditingService(null);
    setIsFormOpen(true);
  }

  function handleEdit(
    service: ServiceApiResponse,
  ) {
    setEditingService(service);
    setIsFormOpen(true);
  }

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this service?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteService(id);

      toast.success(
        "Service deleted successfully.",
      );

      await loadServices();
    } catch (error: any) {
      console.error(
        "DELETE SERVICE ERROR:",
        error?.response?.data ?? error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete service.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleFormSuccess() {
    setIsFormOpen(false);
    setEditingService(null);

    loadServices();
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading your services...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Settings2 className="size-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Services
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create and manage the services you offer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadServices}
              className="flex size-11 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted"
              aria-label="Refresh services"
            >
              <RefreshCw className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Add Service
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total Services
            </p>

            <p className="mt-2 text-3xl font-bold">
              {services.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Active Services
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                services.filter(
                  (service) =>
                    service.isActive !==
                    false,
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Average Price
            </p>

            <p className="mt-2 text-3xl font-bold">
              $
              {services.length
                ? (
                    services.reduce(
                      (
                        total,
                        service,
                      ) =>
                        total +
                        Number(
                          service.price,
                        ),
                      0,
                    ) /
                    services.length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        {/* Service List */}
        <section className="mt-8">
          {services.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Plus className="size-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No services yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Create your first service so
                customers can discover and book
                you.
              </p>

              <button
                type="button"
                onClick={handleCreate}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="size-4" />
                Create Your First Service
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map(
                (service) => (
                  <article
                    key={service.id}
                    className="rounded-3xl border border-border/70 bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-black/5"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold">
                            {service.title}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              service.isActive ===
                              false
                                ? "bg-muted text-muted-foreground"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {service.isActive ===
                            false
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {
                            service.description
                          }
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          Price
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          $
                          {Number(
                            service.price,
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-[11px] text-muted-foreground">
                          Category
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold">
                          {service
                            .category
                            ?.name ??
                            "Unknown"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-[11px] text-muted-foreground">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {
                            service.duration
                          }{" "}
                          min
                        </p>
                      </div>

                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-[11px] text-muted-foreground">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {service.isActive ===
                          false
                            ? "Inactive"
                            : "Active"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-border/60 pt-5">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            service,
                          )
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <Settings2 className="size-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          service.id
                        }
                        onClick={() =>
                          handleDelete(
                            service.id,
                          )
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-destructive/20 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        service.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}

                        Delete
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setIsFormOpen(false);
            setEditingService(null);
          }}
          onSuccess={
            handleFormSuccess
          }
        />
      )}
    </main>
  );
}