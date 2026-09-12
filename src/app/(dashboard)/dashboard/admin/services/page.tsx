"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

interface Category {
  id: string;
  name: string;
}

interface Technician {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
  location?: string | null;
}

interface Service {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number | string;
  duration: number;
  image?: string | null;
  isActive: boolean;
  category?: {
    id?: string;
    name?: string;
  } | null;
  technician?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fixitnow-backend-gz17.onrender.com";

export default function AdminServicesPage() {
  const router = useRouter();
const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [viewingService, setViewingService] =
    useState<Service | null>(null);

  const [deletingService, setDeletingService] =
    useState<Service | null>(null);

  const [editForm, setEditForm] = useState({
    categoryId: "",
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    isActive: true,
  });

  const isAdmin = user?.role === "ADMIN";

  const getToken = () => {
    if (typeof document === "undefined") {
      return "";
    }

    const cookie = document.cookie
      .split("; ")
      .find((row) =>
        row.startsWith("fixitnow_access_token="),
      );

    return cookie
      ? decodeURIComponent(cookie.split("=")[1] || "")
      : "";
  };

  const getHeaders = () => {
    const token = getToken();

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const getErrorMessage = (
    error: unknown,
    fallback: string,
  ) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (
        responseData &&
        typeof responseData.message === "string"
      ) {
        return responseData.message;
      }

      if (Array.isArray(responseData?.errorDetails)) {
        const messages = responseData.errorDetails
          .map((item: unknown) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "message" in item
            ) {
              return String(
                (item as { message?: unknown }).message ||
                  "",
              );
            }

            return "";
          })
          .filter(Boolean);

        if (messages.length) {
          return messages.join(", ");
        }
      }
    }

    return fallback;
  };

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${API_URL}/api/api/services`,
        {
          headers: getHeaders(),
        },
      );

      const data = response.data?.data;

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to load services.",
        ),
      );

      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/api/categories`,
        {
          headers: getHeaders(),
        },
      );

      const data = response.data?.data;

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to load categories.",
        ),
      );

      setCategories([]);
    }
  }, []);

  useEffect(() => {
  if (!user) {
    router.replace("/login");
    return;
  }

  if (user.role !== "ADMIN") {
    router.replace("/dashboard");
    return;
  }

  fetchServices();
  fetchCategories();
}, [
  user,
  router,
  fetchServices,
  fetchCategories,
]);

  const stats = useMemo(() => {
    const total = services.length;

    const active = services.filter(
      (service) => service.isActive,
    ).length;

    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !search ||
        service.title.toLowerCase().includes(search) ||
        service.description
          .toLowerCase()
          .includes(search) ||
        service.category?.name
          ?.toLowerCase()
          .includes(search) ||
        service.technician?.name
          ?.toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        service.categoryId === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          service.isActive) ||
        (statusFilter === "inactive" &&
          !service.isActive);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    services,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  const openEditModal = (service: Service) => {
    setEditingService(service);

    setEditForm({
      categoryId: service.categoryId || "",
      title: service.title || "",
      description: service.description || "",
      price: String(service.price ?? ""),
      duration: String(service.duration ?? ""),
      image: service.image || "",
      isActive: service.isActive,
    });
  };

  const closeEditModal = () => {
    if (updatingId) return;

    setEditingService(null);
  };

  const handleEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingService || !isAdmin) return;

    if (!editForm.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (editForm.title.trim().length < 3) {
      toast.error(
        "Service title must be at least 3 characters.",
      );
      return;
    }

    if (editForm.description.trim().length < 10) {
      toast.error(
        "Description must be at least 10 characters.",
      );
      return;
    }

    const price = Number(editForm.price);
    const duration = Number(editForm.duration);

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
        "Duration must be an integer between 15 and 1440 minutes.",
      );
      return;
    }

    try {
      setUpdatingId(editingService.id);

      const payload = {
        categoryId: editForm.categoryId,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price,
        duration,
        image: editForm.image.trim() || undefined,
        isActive: editForm.isActive,
      };

      const response = await axios.patch(
        `${API_URL}/api/api/services/${editingService.id}`,
        payload,
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
        },
      );

      const updatedService =
        response.data?.data;

      setServices((previous) =>
        previous.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                ...(updatedService || payload),
                categoryId: payload.categoryId,
              }
            : service,
        ),
      );

      toast.success(
        "Service updated successfully.",
      );

      closeEditModal();

      await fetchServices();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to update service.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (
    service: Service,
  ) => {
    if (!isAdmin) return;

    try {
      setUpdatingId(service.id);

      const newStatus = !service.isActive;

      await axios.patch(
        `${API_URL}/api/api/services/${service.id}`,
        {
          isActive: newStatus,
        },
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
        },
      );

      setServices((previous) =>
        previous.map((item) =>
          item.id === service.id
            ? {
                ...item,
                isActive: newStatus,
              }
            : item,
        ),
      );

      toast.success(
        newStatus
          ? "Service activated successfully."
          : "Service deactivated successfully.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to update service status.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingService || !isAdmin) return;

    try {
      setDeletingId(deletingService.id);

      await axios.delete(
        `${API_URL}/api/api/services/${deletingService.id}`,
        {
          headers: getHeaders(),
        },
      );

      setServices((previous) =>
        previous.filter(
          (service) =>
            service.id !== deletingService.id,
        ),
      );

      toast.success(
        "Service deleted successfully.",
      );

      setDeletingService(null);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to delete service.",
        ),
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>

            <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
              Admin Management
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Service Management
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor and manage services created by
            technicians.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Services"
            value={stats.total}
            icon={
              <BriefcaseBusiness className="h-5 w-5" />
            }
          />

          <StatCard
            title="Active Services"
            value={stats.active}
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
          />

          <StatCard
            title="Inactive Services"
            value={stats.inactive}
            icon={
              <XCircle className="h-5 w-5" />
            }
          />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search service, category or technician..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-cyan-400/50 lg:w-52"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "all"
                      | "active"
                      | "inactive",
                  )
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-cyan-400/50 lg:w-40"
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Services */}
        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="text-sm text-slate-400">
                Loading services...
              </p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center">
            <BriefcaseBusiness className="mb-4 h-12 w-12 text-slate-700" />

            <h2 className="text-lg font-semibold">
              No services found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isUpdating={
                  updatingId === service.id
                }
                onView={() =>
                  setViewingService(service)
                }
                onEdit={() =>
                  openEditModal(service)
                }
                onToggle={() =>
                  handleToggleStatus(service)
                }
                onDelete={() =>
                  setDeletingService(service)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingService && (
        <Modal
          onClose={() =>
            setViewingService(null)
          }
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                Service Details
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {viewingService.title}
              </h2>
            </div>

            {viewingService.image && (
              <img
                src={viewingService.image}
                alt={viewingService.title}
                className="h-56 w-full rounded-2xl object-cover"
              />
            )}

            <p className="text-sm leading-7 text-slate-400">
              {viewingService.description}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoBox
                label="Price"
                value={`$${Number(
                  viewingService.price,
                ).toFixed(2)}`}
              />

              <InfoBox
                label="Duration"
                value={`${viewingService.duration} min`}
              />

              <InfoBox
                label="Category"
                value={
                  viewingService.category?.name ||
                  "Unknown"
                }
              />

              <InfoBox
                label="Status"
                value={
                  viewingService.isActive
                    ? "Active"
                    : "Inactive"
                }
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                {viewingService.technician
                  ?.image ? (
                  <img
                    src={
                      viewingService.technician
                        .image
                    }
                    alt={
                      viewingService.technician
                        .name || "Technician"
                    }
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10">
                    <UserRound className="h-5 w-5 text-cyan-400" />
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">
                    {viewingService.technician
                      ?.name || "Unknown technician"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {viewingService.technician
                      ?.email ||
                      "Email unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setViewingService(null);
                  openEditModal(viewingService);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/20"
              >
                <Edit3 className="h-4 w-4" />
                Edit Service
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewingService(null);
                  setDeletingService(
                    viewingService,
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-medium text-red-300 hover:bg-red-400/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingService && (
        <Modal onClose={closeEditModal}>
          <form
            onSubmit={handleEditSubmit}
            className="space-y-5"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-400">
                Admin Management
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Edit Service
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Technician assignment is preserved.
              </p>
            </div>

            <FormField label="Category">
              <select
                value={editForm.categoryId}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    categoryId:
                      event.target.value,
                  }))
                }
                className="input"
                disabled={!!updatingId}
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Service Title">
              <input
                type="text"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                className="input"
                disabled={!!updatingId}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    description:
                      event.target.value,
                  }))
                }
                rows={5}
                className="input resize-none"
                disabled={!!updatingId}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Price ($)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  className="input"
                  disabled={!!updatingId}
                />
              </FormField>

              <FormField label="Duration (minutes)">
                <input
                  type="number"
                  min="15"
                  max="1440"
                  value={editForm.duration}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      duration:
                        event.target.value,
                    }))
                  }
                  className="input"
                  disabled={!!updatingId}
                />
              </FormField>
            </div>

            <FormField label="Image URL">
              <input
                type="url"
                value={editForm.image}
                onChange={(event) =>
                  setEditForm((previous) => ({
                    ...previous,
                    image: event.target.value,
                  }))
                }
                className="input"
                disabled={!!updatingId}
              />
            </FormField>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Service Status
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Control whether customers can see
                    this service.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditForm((previous) => ({
                      ...previous,
                      isActive:
                        !previous.isActive,
                    }))
                  }
                  disabled={!!updatingId}
                  className={`relative h-6 w-11 rounded-full transition ${
                    editForm.isActive
                      ? "bg-cyan-500"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      editForm.isActive
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={!!updatingId}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!!updatingId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
              >
                {updatingId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Update Service
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {deletingService && (
        <Modal
          onClose={() => {
            if (!deletingId) {
              setDeletingService(null);
            }
          }}
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Delete Service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {deletingService.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeletingService(null)
                }
                disabled={!!deletingId}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!!deletingId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Service
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.7);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgba(34, 211, 238, 0.5);
        }

        .input::placeholder {
          color: rgb(71, 85, 105);
        }

        .input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        select.input option {
          background: rgb(15, 23, 42);
          color: white;
        }
      `}</style>
    </div>
  );
}

function ServiceCard({
  service,
  isUpdating,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: {
  service: Service;
  isUpdating: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="relative h-48 overflow-hidden bg-slate-900">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BriefcaseBusiness className="h-12 w-12 text-slate-700" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
            service.isActive
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-red-400/10 text-red-300"
          }`}
        >
          {service.isActive
            ? "Active"
            : "Inactive"}
        </span>

        <span className="absolute bottom-4 right-4 text-lg font-bold">
          ${Number(service.price).toFixed(2)}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold">
            {service.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-cyan-400" />
            {service.duration} min
          </span>

          <span className="inline-flex min-w-0 items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5 text-cyan-400" />
            <span className="truncate">
              {service.technician?.name ||
                "Unknown technician"}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onView}
            className="action-button"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="action-button text-cyan-300"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={isUpdating}
            className={`action-button ${
              service.isActive
                ? "text-amber-300"
                : "text-emerald-300"
            }`}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : service.isActive ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            {service.isActive
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="action-button text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.625rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgb(203, 213, 225);
          transition: 0.2s ease;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.07);
        }

        .action-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {title}
      </p>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      {children}
    </div>
  );
}