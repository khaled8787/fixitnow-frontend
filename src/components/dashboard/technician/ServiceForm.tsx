"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createService,
  updateService,
  type ServiceApiResponse,
} from "@/services/service.service";

import {
  getCategories,
  type CategoryApiResponse,
} from "@/services/category.service";

interface ServiceFormProps {
  service: ServiceApiResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceForm({
  service,
  onClose,
  onSuccess,
}: ServiceFormProps) {
  const isEditing = Boolean(service);

  const [categories, setCategories] =
    useState<CategoryApiResponse[]>([]);

  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState(true);

  const [categoryId, setCategoryId] =
    useState(service?.categoryId ?? "");

  const [title, setTitle] =
    useState(service?.title ?? "");

  const [description, setDescription] =
    useState(service?.description ?? "");

  const [price, setPrice] =
    useState(
      service?.price !== undefined
        ? String(service.price)
        : "",
    );

  const [duration, setDuration] =
    useState(
      service?.duration !== undefined
        ? String(service.duration)
        : "",
    );

  const [isActive, setIsActive] =
    useState(
      service?.isActive !== false,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * Load categories
   */
  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);

        const response =
          await getCategories();

        const data = Array.isArray(
          response?.data,
        )
          ? response.data
          : [];

        if (mounted) {
          setCategories(data);
        }
      } catch (error: any) {
        console.error(
          "CATEGORY API ERROR:",
          error?.response?.data ?? error,
        );

        if (mounted) {
          toast.error(
            error?.response?.data?.message ??
              "Failed to load categories.",
          );
        }
      } finally {
        if (mounted) {
          setIsCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Submit
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!categoryId) {
      toast.error(
        "Please select a service category.",
      );
      return;
    }

    if (!title.trim()) {
      toast.error(
        "Service title is required.",
      );
      return;
    }

    if (title.trim().length < 3) {
      toast.error(
        "Title must be at least 3 characters.",
      );
      return;
    }

    if (!description.trim()) {
      toast.error(
        "Service description is required.",
      );
      return;
    }

    if (description.trim().length < 10) {
      toast.error(
        "Description must be at least 10 characters.",
      );
      return;
    }

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      toast.error(
        "Please enter a valid price.",
      );
      return;
    }

    const numericDuration =
      Number(duration);

    if (
      !Number.isInteger(numericDuration) ||
      numericDuration < 15 ||
      numericDuration > 1440
    ) {
      toast.error(
        "Duration must be between 15 and 1440 minutes.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing && service) {
        await updateService(service.id, {
          categoryId,
          title: title.trim(),
          description: description.trim(),
          price: numericPrice,
          duration: numericDuration,
          isActive,
        });

        toast.success(
          "Service updated successfully.",
        );
      } else {
        await createService({
          categoryId,
          title: title.trim(),
          description: description.trim(),
          price: numericPrice,
          duration: numericDuration,
        });

        toast.success(
          "Service created successfully.",
        );
      }

      onSuccess();
    } catch (error: any) {
      console.error(
        "SERVICE FORM ERROR:",
        error?.response?.data ?? error,
      );

      const message =
        error?.response?.data?.message;

      const errorDetails =
        error?.response?.data?.errorDetails;

      if (Array.isArray(errorDetails)) {
        const validationMessage =
          errorDetails
            .map(
              (item: any) =>
                item?.message ??
                String(item),
            )
            .join(", ");

        toast.error(
          validationMessage ||
            "Validation failed.",
        );
      } else {
        toast.error(
          message ??
            "Failed to save service.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/95 px-6 py-5 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold">
              {isEditing
                ? "Edit Service"
                : "Create New Service"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing
                ? "Update your service information."
                : "Add a service customers can book."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50"
            aria-label="Close form"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Category */}
          <div>
            <label
              htmlFor="service-category"
              className="text-sm font-semibold"
            >
              Service Category
            </label>

            <select
              id="service-category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  event.target.value,
                )
              }
              disabled={
                isCategoriesLoading ||
                isSubmitting
              }
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {isCategoriesLoading
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

            {!isCategoriesLoading &&
              categories.length === 0 && (
                <p className="mt-2 text-xs text-destructive">
                  No categories are available.
                  Please contact an administrator.
                </p>
              )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="service-title"
              className="text-sm font-semibold"
            >
              Service Title
            </label>

            <input
              id="service-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Professional Home Cleaning"
              maxLength={100}
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />

            <div className="mt-1 text-right text-xs text-muted-foreground">
              {title.length}/100
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="service-description"
              className="text-sm font-semibold"
            >
              Description
            </label>

            <textarea
              id="service-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="Describe what customers will receive..."
              rows={5}
              maxLength={1000}
              disabled={isSubmitting}
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />

            <div className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/1000
            </div>
          </div>

          {/* Price + Duration */}
          <div className="grid gap-5 sm:grid-cols-2">

            {/* Price */}
            <div>
              <label
                htmlFor="service-price"
                className="text-sm font-semibold"
              >
                Price
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>

                <input
                  id="service-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value,
                    )
                  }
                  placeholder="50"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="service-duration"
                className="text-sm font-semibold"
              >
                Duration
              </label>

              <div className="relative mt-2">
                <input
                  id="service-duration"
                  type="number"
                  min="15"
                  max="1440"
                  step="1"
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      event.target.value,
                    )
                  }
                  placeholder="60"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-20 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  minutes
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Minimum 15 minutes, maximum 24 hours.
              </p>
            </div>
          </div>

          {/* Active status */}
          {isEditing && (
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div>
                <p className="text-sm font-semibold">
                  Service Active
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Active services can be discovered
                  by customers.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(
                    event.target.checked,
                  )
                }
                disabled={isSubmitting}
                className="size-5 accent-primary"
              />
            </label>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isCategoriesLoading ||
                categories.length === 0
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {isEditing
                ? "Update Service"
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}