
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Save,
  Tag,
  ToggleLeft,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  description?: string | null;
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
  category?: Category | null;
}

interface ServiceForm {
  categoryId: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  isActive: boolean;
}

const initialForm: ServiceForm = {
  categoryId: "",
  title: "",
  description: "",
  price: "",
  duration: "",
  isActive: true,
};

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();

  const serviceId =
    typeof params?.id === "string"
      ? params.id
      : "";

  const [service, setService] =
    useState<Service | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [form, setForm] =
    useState<ServiceForm>(initialForm);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);
   

  
  useEffect(() => {
    if (!serviceId) {
      toast.error("Invalid service ID.");
      router.replace("/dashboard/services");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingCategories(true);

        const [serviceResponse, categoryResponse] =
          await Promise.all([
            api.get(
              `/api/api/services/${serviceId}`,
            ),
            api.get("/api/api/categories"),
          ]);

        /*
         * Service response
         */
        const serviceData =
          serviceResponse.data?.data;

        if (!serviceData) {
          throw new Error(
            "Service information was not returned by the server.",
          );
        }

        setService(serviceData);

        setForm({
          categoryId:
            serviceData.categoryId ?? "",

          title:
            serviceData.title ?? "",

          description:
            serviceData.description ?? "",

          price:
            serviceData.price !== undefined &&
            serviceData.price !== null
              ? String(serviceData.price)
              : "",

          duration:
            serviceData.duration !== undefined &&
            serviceData.duration !== null
              ? String(serviceData.duration)
              : "",

          isActive:
            serviceData.isActive ?? true,
        });

        /*
         * Categories response
         */
        const categoryData =
          categoryResponse.data?.data;

        if (!Array.isArray(categoryData)) {
          setCategories([]);
        } else {
          setCategories(categoryData);
        }
      } catch (error: any) {
        console.error(
          "LOAD EDIT SERVICE ERROR:",
          error,
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load service information.";

        toast.error(message);

        /*
         * If service doesn't exist, go back.
         */
        if (
          error?.response?.status === 404
        ) {
          router.replace(
            "/dashboard/services",
          );
        }
      } finally {
        setIsLoading(false);
        setIsLoadingCategories(false);
      }
    };

    loadData();
  }, [serviceId, router]);

  /*
   * -------------------------------------------------------
   * Form change handler
   * -------------------------------------------------------
   */
  const handleChange = (
    field: keyof ServiceForm,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * -------------------------------------------------------
   * Submit update
   * -------------------------------------------------------
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!serviceId) {
      toast.error("Service ID is missing.");
      return;
    }

    /*
     * Category
     */
    if (!form.categoryId.trim()) {
      toast.error("Please select a category.");
      return;
    }

    /*
     * Title
     */
    const title = form.title.trim();

    if (!title) {
      toast.error("Please enter a service title.");
      return;
    }

    if (title.length < 3) {
      toast.error(
        "Title must be at least 3 characters.",
      );
      return;
    }

    if (title.length > 100) {
      toast.error(
        "Title cannot exceed 100 characters.",
      );
      return;
    }

    /*
     * Description
     */
    const description =
      form.description.trim();

    if (!description) {
      toast.error(
        "Please enter a service description.",
      );
      return;
    }

    if (description.length < 10) {
      toast.error(
        "Description must be at least 10 characters.",
      );
      return;
    }

    if (description.length > 1000) {
      toast.error(
        "Description cannot exceed 1000 characters.",
      );
      return;
    }

    /*
     * Price
     */
    const price = Number(form.price);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      toast.error(
        "Please enter a valid price greater than 0.",
      );
      return;
    }

    /*
     * Duration
     */
    const duration = Number(
      form.duration,
    );

    if (
      !Number.isInteger(duration) ||
      duration < 15 ||
      duration > 1440
    ) {
      toast.error(
        "Duration must be an integer between 15 and 1440 minutes.",
      );
      return;
    }

    /*
     * Exact backend payload.
     *
     * No image.
     * No technicianId.
     * No extra fields.
     */
    const payload = {
      categoryId: form.categoryId,
      title,
      description,
      price,
      duration,
      isActive: form.isActive,
    };

    try {
      setIsSubmitting(true);

      console.log(
        "UPDATE SERVICE PAYLOAD:",
        payload,
      );

      console.log(
        "UPDATE SERVICE URL:",
        `/api/api/services/${serviceId}`,
      );

      const response = await api.patch(
        `/api/api/services/${serviceId}`,
        payload,
      );

      console.log(
        "UPDATE SERVICE RESPONSE:",
        response.data,
      );

      toast.success(
        response.data?.message ||
          "Service updated successfully!",
      );

      
      router.push(
        "/dashboard/services",
      );

      router.refresh();
    } catch (error: any) {
      console.error(
        "UPDATE SERVICE ERROR:",
        error,
      );

      console.error(
        "UPDATE SERVICE BACKEND RESPONSE:",
        error?.response?.data,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update service.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />

          Loading service...
        </div>
      </main>
    );
  }

  
  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Wrench className="size-6" />
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Service not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The requested service could not be
            found or may have been removed.
          </p>

          <Link
            href="/dashboard/services"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to My Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
     

      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/services"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />

            Back to My Services
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wrench className="size-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">
                Technician Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Edit Service
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Update the information of your
                service and save the changes.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm"
          >
            {/* Form title */}
            <div className="border-b border-border/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Save className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Service Information
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Update the fields below and
                    save your changes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
             
              <div className="space-y-2">
                <label
                  htmlFor="service-category"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <Tag className="size-4 text-primary" />

                  Category
                </label>

                <select
                  id="service-category"
                  value={form.categoryId}
                  onChange={(event) =>
                    handleChange(
                      "categoryId",
                      event.target.value,
                    )
                  }
                  disabled={
                    isLoadingCategories ||
                    isSubmitting
                  }
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ),
                  )}
                </select>

                {!isLoadingCategories &&
                  categories.length === 0 && (
                    <p className="text-xs text-destructive">
                      No categories are available.
                    </p>
                  )}
              </div>

             
              <div className="space-y-2">
                <label
                  htmlFor="service-title"
                  className="text-sm font-semibold"
                >
                  Service Title
                </label>

                <input
                  id="service-title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleChange(
                      "title",
                      event.target.value,
                    )
                  }
                  maxLength={100}
                  disabled={isSubmitting}
                  placeholder="Enter service title"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {form.title.length}/100
                  </span>
                </div>
              </div>

             
              <div className="space-y-2">
                <label
                  htmlFor="service-description"
                  className="text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="service-description"
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={6}
                  maxLength={1000}
                  disabled={isSubmitting}
                  placeholder="Describe what your service includes..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {form.description.length}/1000
                  </span>
                </div>
              </div>

             
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Price */}

                <div className="space-y-2">
                  <label
                    htmlFor="service-price"
                    className="text-sm font-semibold"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      $
                    </span>

                    <input
                      id="service-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        handleChange(
                          "price",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      placeholder="50"
                      className="h-12 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Price must be greater than 0.
                  </p>
                </div>

                {/* Duration */}

                <div className="space-y-2">
                  <label
                    htmlFor="service-duration"
                    className="flex items-center gap-2 text-sm font-semibold"
                  >
                    <Clock3 className="size-4 text-primary" />

                    Duration
                  </label>

                  <div className="relative">
                    <input
                      id="service-duration"
                      type="number"
                      min="15"
                      max="1440"
                      step="1"
                      value={form.duration}
                      onChange={(event) =>
                        handleChange(
                          "duration",
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      placeholder="60"
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-20 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      minutes
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Between 15 and 1440 minutes.
                  </p>
                </div>
              </div>

             
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ToggleLeft className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Service Status
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Active services can be
                        displayed and booked by
                        customers.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleChange(
                        "isActive",
                        !form.isActive,
                      )
                    }
                    className={`relative inline-flex h-11 w-full items-center rounded-xl px-4 text-sm font-semibold transition-all sm:w-auto ${
                      form.isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span
                      className={`mr-3 size-2.5 rounded-full ${
                        form.isActive
                          ? "bg-primary-foreground"
                          : "bg-muted-foreground"
                      }`}
                    />

                    {form.isActive
                      ? "Active"
                      : "Inactive"}
                  </button>
                </div>
              </div>

             
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">
                      Ready to save?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your changes will be sent to
                      the FixItNow backend and
                      applied to this service.
                    </p>
                  </div>
                </div>
              </div>

             
              <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-7 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/services",
                    )
                  }
                  disabled={isSubmitting}
                  className="h-12 rounded-xl border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isLoadingCategories ||
                    categories.length === 0
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
