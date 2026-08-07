"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated } =
    useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [formData, setFormData] =
    useState<CategoryFormData>({
      name: "",
      description: "",
    });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await api.get(
        "/api/api/categories",
      );

      const data = response.data?.data;

      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(
        "❌ GET CATEGORIES ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load categories.",
      );

      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      isAuthLoading ||
      !isAuthenticated ||
      user?.role !== "ADMIN"
    ) {
      return;
    }

    fetchCategories();
  }, [
    isAuthLoading,
    isAuthenticated,
    user?.role,
    fetchCategories,
  ]);

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description ?? "",
    });

    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setFormErrors({});
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      description?: string;
    } = {};

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      errors.name = "Category name is required.";
    } else if (name.length < 2) {
      errors.name =
        "Category name must be at least 2 characters.";
    }

    if (description.length > 1000) {
      errors.description =
        "Description cannot exceed 1000 characters.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        description:
          formData.description.trim() || undefined,
      };

      if (editingCategory) {
        await api.patch(
          `/api/api/categories/${editingCategory.id}`,
          payload,
        );

        toast.success(
          "Category updated successfully.",
        );
      } else {
        await api.post(
          "/api/api/categories",
          payload,
        );

        toast.success(
          "Category created successfully.",
        );
      }

      closeModal();
      await fetchCategories();
    } catch (error: any) {
      console.error(
        "❌ CATEGORY SAVE ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save category.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (
    category: Category,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);

      await api.delete(
        `/api/api/categories/${category.id}`,
      );

      toast.success(
        "Category deleted successfully.",
      );

      await fetchCategories();
    } catch (error: any) {
      console.error(
        "❌ DELETE CATEGORY ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete category.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Access denied
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Only administrators can manage categories.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <span className="size-2 rounded-full bg-primary" />
                Admin Dashboard
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Categories
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Create and manage service categories used
                by technicians when creating services.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchCategories}
                disabled={isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-4 ${
                    isLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
              >
                <Plus className="size-4" />
                Create Category
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Categories
              </p>

              <p className="mt-2 text-3xl font-bold">
                {categories.length}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />

                <span className="text-sm font-semibold">
                  Connected to backend
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold">
                  All Categories
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Categories stored in your database.
                </p>
              </div>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {categories.length}
              </span>
            </div>

            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  Loading categories...
                </div>
              </div>
            ) : categories.length === 0 ? (
              <EmptyCategories
                onCreate={openCreateModal}
              />
            ) : (
              <div className="divide-y divide-border/60">
                {categories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    isDeleting={
                      deletingId === category.id
                    }
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between border-b border-border/60 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingCategory
                    ? "Edit Category"
                    : "Create Category"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingCategory
                    ? "Update the category information."
                    : "Add a new service category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
              noValidate
            >
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="category-name"
                  className="text-sm font-semibold"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => {
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }));

                    if (formErrors.name) {
                      setFormErrors((current) => ({
                        ...current,
                        name: undefined,
                      }));
                    }
                  }}
                  placeholder="e.g. Plumbing"
                  disabled={isSubmitting}
                  className={`h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                    formErrors.name
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />

                {formErrors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="category-description"
                  className="text-sm font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  value={formData.description}
                  onChange={(event) => {
                    setFormData((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }));

                    if (formErrors.description) {
                      setFormErrors((current) => ({
                        ...current,
                        description: undefined,
                      }));
                    }
                  }}
                  placeholder="Describe this service category..."
                  rows={5}
                  disabled={isSubmitting}
                  className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                    formErrors.description
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />

                {formErrors.description && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />

                      {editingCategory
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Category Row                                                               */
/* -------------------------------------------------------------------------- */

interface CategoryRowProps {
  category: Category;
  isDeleting: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryRow({
  category,
  isDeleting,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {category.name
              .trim()
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold">
              {category.name}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              ID: {category.id}
            </p>
          </div>
        </div>

        {category.description && (
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(category)}
          disabled={isDeleting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <Pencil className="size-4" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(category)}
          disabled={isDeleting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-destructive/20 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:pointer-events-none disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}

          Delete
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyCategories({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Plus className="size-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        No categories yet
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Create a category first. Technicians can then
        select that category when creating a service.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="size-4" />
        Create Category
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading Screen                                                             */
/* -------------------------------------------------------------------------- */

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        Checking your account...
      </div>
    </main>
  );
}