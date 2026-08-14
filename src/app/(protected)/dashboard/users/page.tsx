"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { getAccessToken } from "@/lib/auth";

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
type UserStatus = "ACTIVE" | "BANNED";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

type RoleFilter = "ALL" | UserRole;
type StatusFilter = "ALL" | UserStatus;

const roleOptions: {
  value: RoleFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All Roles" },
  { value: "CUSTOMER", label: "Customers" },
  { value: "TECHNICIAN", label: "Technicians" },
  { value: "ADMIN", label: "Admins" },
];

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "BANNED", label: "Banned" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  const [deleteUser, setDeleteUser] =
    useState<UserData | null>(null);

  /*
  ============================================================
  LOAD USERS
  ============================================================
  */

  const loadUsers = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const params: Record<string, string> = {};

        if (searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        if (roleFilter !== "ALL") {
          params.role = roleFilter;
        }

        if (statusFilter !== "ALL") {
          params.status = statusFilter;
        }

        const response = await api.get<
          ApiResponse<UserData[]>
        >("/api/api/users", {
          params,
        });

        const data = response.data?.data;

        if (!Array.isArray(data)) {
          setUsers([]);

          toast.error(
            "Invalid users response from backend.",
          );

          return;
        }

        setUsers(data);
      } catch (error: any) {
        console.error(
          "LOAD ADMIN USERS ERROR:",
          error,
        );

        const status = error?.response?.status;

        if (status === 401) {
          toast.error(
            "Authentication required. Please login again.",
          );
        } else if (status === 403) {
          toast.error(
            "You are not authorized to access admin users.",
          );
        } else {
          toast.error(
            error?.response?.data?.message ||
              "Failed to load users.",
          );
        }

        setUsers([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchTerm, roleFilter, statusFilter],
  );

  /*
  ============================================================
  ADMIN ACCESS CHECK
  ============================================================
  */

  const [isCheckingAccess, setIsCheckingAccess] =
    useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = getAccessToken();

        if (!token) {
          setIsAdmin(false);
          return;
        }

        /*
         * We intentionally use the backend response as the
         * final authority.
         *
         * The users endpoint itself is protected by:
         * auth(Role.ADMIN)
         *
         * So a non-admin will receive 403.
         */

        const response = await api.get<
          ApiResponse<UserData[]>
        >("/api/api/users");

        if (
          response.status === 200 &&
          response.data?.success !== false
        ) {
          setIsAdmin(true);
        }
      } catch (error: any) {
        console.error(
          "ADMIN ACCESS CHECK ERROR:",
          error,
        );

        setIsAdmin(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAdminAccess();
  }, []);

  /*
  ============================================================
  INITIAL / FILTER LOAD
  ============================================================
  */

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    loadUsers();
  }, [isAdmin, loadUsers]);

  /*
  ============================================================
  UPDATE USER STATUS
  ============================================================
  */

  const handleStatusChange = async (
    user: UserData,
  ) => {
    const nextStatus: UserStatus =
      user.status === "ACTIVE"
        ? "BANNED"
        : "ACTIVE";

    try {
      setUpdatingUserId(user.id);

      const response = await api.patch<
        ApiResponse<UserData>
      >(`/api/api/users/${user.id}/status`, {
        status: nextStatus,
      });

      const updatedUser =
        response.data?.data;

      if (updatedUser) {
        setUsers((currentUsers) =>
          currentUsers.map((item) =>
            item.id === user.id
              ? updatedUser
              : item,
          ),
        );
      } else {
        setUsers((currentUsers) =>
          currentUsers.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  status: nextStatus,
                }
              : item,
          ),
        );
      }

      toast.success(
        nextStatus === "BANNED"
          ? `${user.name} has been banned.`
          : `${user.name} has been activated.`,
      );
    } catch (error: any) {
      console.error(
        "UPDATE USER STATUS ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update user status.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  /*
  ============================================================
  DELETE USER
  ============================================================
  */

  const handleDeleteUser = async () => {
    if (!deleteUser) {
      return;
    }

    try {
      setDeletingUserId(deleteUser.id);

      await api.delete(
        `/api/api/users/${deleteUser.id}`,
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) =>
            user.id !== deleteUser.id,
        ),
      );

      toast.success(
        `${deleteUser.name} has been deleted.`,
      );

      setDeleteUser(null);
    } catch (error: any) {
      console.error(
        "DELETE USER ERROR:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user.",
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  /*
  ============================================================
  LOCAL FILTER
  ============================================================
  */

  const filteredUsers = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user.phone
          ?.toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  /*
  ============================================================
  STATS
  ============================================================
  */

  const totalUsers = users.length;

  const customerCount = users.filter(
    (user) => user.role === "CUSTOMER",
  ).length;

  const technicianCount = users.filter(
    (user) => user.role === "TECHNICIAN",
  ).length;

  const bannedCount = users.filter(
    (user) => user.status === "BANNED",
  ).length;

  /*
  ============================================================
  ACCESS CHECK LOADING
  ============================================================
  */

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />

          <div>
            <p className="font-semibold">
              Checking admin access...
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please wait.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  ============================================================
  ACCESS DENIED
  ============================================================
  */

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-8 text-center shadow-xl">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Shield className="size-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You are not authorized to access
            the admin users management page.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  /*
  ============================================================
  PAGE
  ============================================================
  */

  return (
    <main className="min-h-screen bg-background">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/admin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />

            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="size-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-primary">
                  Admin Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  User Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Manage customers, technicians,
                  and admin accounts from one place.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadUsers(true)
              }
              disabled={
                isLoading ||
                isRefreshing
              }
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
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
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ==================================================
              STATISTICS
          =================================================== */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Users"
              value={totalUsers}
              icon={
                <Users className="size-5" />
              }
            />

            <StatCard
              label="Customers"
              value={customerCount}
              icon={
                <User className="size-5" />
              }
            />

            <StatCard
              label="Technicians"
              value={technicianCount}
              icon={
                <Shield className="size-5" />
              }
            />

            <StatCard
              label="Banned Users"
              value={bannedCount}
              icon={
                <Ban className="size-5" />
              }
            />
          </div>

          {/* ==================================================
              FILTERS
          =================================================== */}

          <div className="mb-8 rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
              {/* Search */}

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder="Search by name, email or phone..."
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Role */}

              <SelectFilter
                value={roleFilter}
                onChange={(value) =>
                  setRoleFilter(
                    value as RoleFilter,
                  )
                }
                options={roleOptions}
              />

              {/* Status */}

              <SelectFilter
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(
                    value as StatusFilter,
                  )
                }
                options={statusOptions}
              />
            </div>
          </div>

          {/* ==================================================
              USERS
          =================================================== */}

          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-border/60 bg-background">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Loading users...
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Fetching users from the backend.
                  </p>
                </div>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No users found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try changing your search or
                filter options.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map(
                      (user) => (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          isUpdating={
                            updatingUserId ===
                            user.id
                          }
                          isDeleting={
                            deletingUserId ===
                            user.id
                          }
                          onStatusChange={() =>
                            handleStatusChange(
                              user,
                            )
                          }
                          onDelete={() =>
                            setDeleteUser(
                              user,
                            )
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="grid gap-4 p-4 md:hidden">
                {filteredUsers.map(
                  (user) => (
                    <UserMobileCard
                      key={user.id}
                      user={user}
                      isUpdating={
                        updatingUserId ===
                        user.id
                      }
                      isDeleting={
                        deletingUserId ===
                        user.id
                      }
                      onStatusChange={() =>
                        handleStatusChange(
                          user,
                        )
                      }
                      onDelete={() =>
                        setDeleteUser(
                          user,
                        )
                      }
                    />
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          DELETE MODAL
      ======================================================= */}

      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          isLoading={
            deletingUserId ===
            deleteUser.id
          }
          onClose={() => {
            if (!deletingUserId) {
              setDeleteUser(null);
            }
          }}
          onConfirm={
            handleDeleteUser
          }
        />
      )}
    </main>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

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

/* ============================================================
   SELECT FILTER
============================================================ */

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 min-w-[170px] appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/* ============================================================
   USER TABLE ROW
============================================================ */

function UserTableRow({
  user,
  isUpdating,
  isDeleting,
  onStatusChange,
  onDelete,
}: {
  user: UserData;
  isUpdating: boolean;
  isDeleting: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20">
      {/* User */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              ID: {user.id}
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}

      <td className="px-5 py-4">
        <p className="text-sm">
          {user.email}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {user.phone || "No phone"}
        </p>
      </td>

      {/* Role */}

      <td className="px-5 py-4">
        <RoleBadge role={user.role} />
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <StatusBadge
          status={user.status}
        />
      </td>

      {/* Joined */}

      <td className="px-5 py-4">
        <p className="text-sm">
          {formatDate(
            user.createdAt,
          )}
        </p>
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onStatusChange}
            disabled={
              isUpdating ||
              isDeleting ||
              user.role === "ADMIN"
            }
            title={
              user.role === "ADMIN"
                ? "Admin status cannot be changed here"
                : user.status ===
                    "ACTIVE"
                  ? "Ban user"
                  : "Activate user"
            }
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : user.status ===
              "ACTIVE" ? (
              <Ban className="size-4 text-destructive" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-600" />
            )}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={
              isUpdating ||
              isDeleting ||
              user.role === "ADMIN"
            }
            title={
              user.role === "ADMIN"
                ? "Admin cannot be deleted here"
                : "Delete user"
            }
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   MOBILE USER CARD
============================================================ */

function UserMobileCard({
  user,
  isUpdating,
  isDeleting,
  onStatusChange,
  onDelete,
}: {
  user: UserData;
  isUpdating: boolean;
  isDeleting: boolean;
  onStatusChange: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <StatusBadge
          status={user.status}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoBox
          label="Role"
          value={
            <RoleBadge role={user.role} />
          }
        />

        <InfoBox
          label="Phone"
          value={
            user.phone || "Not provided"
          }
        />

        <InfoBox
          label="Joined"
          value={formatDate(
            user.createdAt,
          )}
        />

        <InfoBox
          label="User ID"
          value={
            <span className="block max-w-full truncate">
              {user.id}
            </span>
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onStatusChange}
          disabled={
            isUpdating ||
            isDeleting ||
            user.role === "ADMIN"
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border text-xs font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isUpdating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : user.status ===
            "ACTIVE" ? (
            <>
              <Ban className="size-4 text-destructive" />
              Ban
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 text-emerald-600" />
              Activate
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={
            isUpdating ||
            isDeleting ||
            user.role === "ADMIN"
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="size-4" />
              Delete
            </>
          )}
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   USER AVATAR
============================================================ */

function UserAvatar({
  user,
}: {
  user: UserData;
}) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="size-full object-cover"
        />
      ) : (
        <User className="size-5" />
      )}
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border/50 bg-muted/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 truncate text-xs font-semibold">
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   ROLE BADGE
============================================================ */

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const config: Record<
    UserRole,
    {
      label: string;
      className: string;
    }
  > = {
    CUSTOMER: {
      label: "Customer",
      className:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },

    TECHNICIAN: {
      label: "Technician",
      className:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },

    ADMIN: {
      label: "Admin",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  };

  const current = config[role];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: UserStatus;
}) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" />

        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
      <span className="size-1.5 rounded-full bg-destructive" />

      Banned
    </span>
  );
}

/* ============================================================
   DELETE MODAL
============================================================ */

function DeleteUserModal({
  user,
  isLoading,
  onClose,
  onConfirm,
}: {
  user: UserData;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Delete User?
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} />

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            Are you sure you want to permanently
            delete this user account?
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/20 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(value: string) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
} 