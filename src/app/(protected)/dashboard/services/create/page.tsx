
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Loader2,
  Plus,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CreateServiceForm {
  categoryId: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

/*
|--------------------------------------------------------------------------
| Frontend service suggestions
|--------------------------------------------------------------------------
| These are only title suggestions.
| The selected title is sent to the backend as `title`.
*/
const serviceTitles = [
  "AC Repair",
  "AC Installation",
  "Plumbing Repair",
  "Electrical Repair",
  "Home Cleaning",
  "Deep Cleaning",
  "Interior Wall Painting",
  "Appliance Repair",
  "Washing Machine Repair",
  "Refrigerator Repair",
  "Water Heater Repair",
  "General Handyman Service",
];

const initialForm: CreateServiceForm = {
  categoryId: "",
  title: "",
  description: "",
  price: "",
  duration: "",
  image: "",
};

export default function CreateServicePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [form, setForm] =
    useState<CreateServiceForm>(initialForm);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreviewError, setImagePreviewError] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load categories from backend
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const response = await api.get(
          "/api/api/categories",
        );

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          if (isMounted) {
            setCategories([]);
          }

          toast.error(
            "No categories were returned from the server.",
          );

          return;
        }

        if (isMounted) {
          setCategories(data);
        }
      } catch (error: any) {
        console.error(
          "CATEGORY LOAD ERROR:",
          error,
        );

        if (isMounted) {
          setCategories([]);
        }

        toast.error(
          error?.response?.data?.message ||
            "Failed to load categories.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle input changes
  |--------------------------------------------------------------------------
  */
  const handleChange = (
    field: keyof CreateServiceForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "image") {
      setImagePreviewError(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Clear image
  |--------------------------------------------------------------------------
  */
  const clearImage = () => {
    setForm((current) => ({
      ...current,
      image: "",
    }));

    setImagePreviewError(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit service
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Please select a service.");
      return;
    }

    if (form.title.trim().length < 3) {
      toast.error(
        "Service title must be at least 3 characters.",
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Please enter a service description.",
      );
      return;
    }

    if (form.description.trim().length < 10) {
      toast.error(
        "Description must be at least 10 characters.",
      );
      return;
    }

    const price = Number(form.price);
    const duration = Number(form.duration);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (
      !Number.isInteger(duration) ||
      duration < 15 ||
      duration > 1440
    ) {
      toast.error(
        "Duration must be between 15 and 1440 minutes.",
      );
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate image URL only when provided
    |--------------------------------------------------------------------------
    */
    const imageUrl = form.image.trim();

    if (imageUrl) {
      try {
        const parsedUrl = new URL(imageUrl);

        if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
        ) {
          toast.error(
            "Image URL must start with http:// or https://",
          );

          return;
        }
      } catch {
        toast.error("Please enter a valid image URL.");
        return;
      }
    }

    const payload = {
      categoryId: form.categoryId,
      title: form.title.trim(),
      description: form.description.trim(),
      price,
      duration,

      /*
      |--------------------------------------------------------------------------
      | Only send image when technician actually provided one.
      |--------------------------------------------------------------------------
      */
      ...(imageUrl ? { image: imageUrl } : {}),
    };

    console.log(
      "CREATE SERVICE PAYLOAD:",
      payload,
    );

    try {
      setIsSubmitting(true);

      const response = await api.post(
        "/api/api/services",
        payload,
      );

      console.log(
        "CREATE SERVICE SUCCESS:",
        response.data,
      );

      toast.success(
        response.data?.message ||
          "Service created successfully!",
      );

      setForm(initialForm);
      setImagePreviewError(false);

      router.push("/dashboard/services");
    } catch (error: any) {
      console.error(
        "CREATE SERVICE ERROR:",
        error,
      );

      console.error(
        "CREATE SERVICE REQUEST URL:",
        error?.config?.baseURL
          ? `${error.config.baseURL}${error.config.url}`
          : error?.config?.url,
      );

      console.error(
        "CREATE SERVICE PAYLOAD:",
        payload,
      );

      console.error(
        "CREATE SERVICE BACKEND RESPONSE:",
        error?.response?.data,
      );

      const backendMessage =
        error?.response?.data?.message;

      const validationDetails =
        error?.response?.data?.errorDetails;

      if (
        Array.isArray(validationDetails) &&
        validationDetails.length > 0
      ) {
        toast.error(
          validationDetails
            .map(
              (item: any) =>
                item?.message || "Validation error",
            )
            .join(", "),
        );
      } else {
        toast.error(
          backendMessage ||
            error?.message ||
            "Failed to create service.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* ---------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus className="size-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-primary">
                Technician Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Create a Service
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Add a service that customers can discover
                and book through FixItNow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Form */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm"
          >
            {/* Form header */}
            <div className="border-b border-border/60 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Service Information
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the information for your new
                    service.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              {/* -------------------------------------------------------- */}
              {/* Service */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-2">
                <label
                  htmlFor="service-title"
                  className="text-sm font-semibold"
                >
                  Service
                </label>

                <select
                  id="service-title"
                  value={form.title}
                  onChange={(event) =>
                    handleChange(
                      "title",
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    Select a service
                  </option>

                  {serviceTitles.map((serviceTitle) => (
                    <option
                      key={serviceTitle}
                      value={serviceTitle}
                    >
                      {serviceTitle}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-muted-foreground">
                  Select the type of service you want to
                  offer.
                </p>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Category */}
              {/* -------------------------------------------------------- */}
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

                  {!isLoadingCategories &&
                    categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>

                {!isLoadingCategories &&
                  categories.length === 0 && (
                    <p className="text-xs text-destructive">
                      No categories are available. Please
                      ask an admin to create a category
                      first.
                    </p>
                  )}
              </div>

              {/* -------------------------------------------------------- */}
              {/* Image URL */}
              {/* -------------------------------------------------------- */}
              <div className="space-y-3">
                <label
                  htmlFor="service-image"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <ImageIcon className="size-4 text-primary" />
                  Service Image
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="service-image"
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      handleChange(
                        "image",
                        event.target.value,
                      )
                    }
                    placeholder="https://example.com/service-image.jpg"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {form.image && (
                    <button
                      type="button"
                      onClick={clearImage}
                      disabled={isSubmitting}
                      aria-label="Clear image URL"
                      className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs leading-5 text-muted-foreground">
                  Paste a publicly accessible image URL.
                  Image upload is not required.
                </p>

                {/* Image preview */}
                {form.image && !imagePreviewError && (
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                    <div className="relative aspect-video w-full">
                      <img
                        src={form.image}
                        alt="Service preview"
                        className="h-full w-full object-cover"
                        onError={() =>
                          setImagePreviewError(true)
                        }
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                        Image Preview
                      </div>
                    </div>
                  </div>
                )}

                {form.image && imagePreviewError && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">
                      Unable to load this image.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Please check that the URL is public
                      and points directly to an image.
                    </p>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------------- */}
              {/* Description */}
              {/* -------------------------------------------------------- */}
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
                  placeholder="Describe what your service includes..."
                  rows={6}
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {form.description.length}/1000
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Price + Duration */}
              {/* -------------------------------------------------------- */}
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
                      placeholder="50"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Enter the starting price for this
                    service.
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
                      placeholder="60"
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-20 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      minutes
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Minimum 15 minutes, maximum 1440
                    minutes.
                  </p>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Confirmation */}
              {/* -------------------------------------------------------- */}
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">
                      Ready to create?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Confirming will save your service,
                      including the optional image URL, to
                      the FixItNow backend.
                    </p>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Actions */}
              {/* -------------------------------------------------------- */}
              <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-7 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard")
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
                      Creating Service...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Create Service
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
