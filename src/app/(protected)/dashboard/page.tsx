"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck2,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* Sidebar */}
        <DashboardSidebar
          role={user.role}
          onLogout={handleLogout}
        />

        {/* Main */}
        <div className="min-w-0 flex-1">
          <DashboardHeader user={user} />

          <div className="px-4 pb-10 sm:px-6 lg:px-8">
            {user.role === "CUSTOMER" && (
              <CustomerDashboard user={user} />
            )}

            {user.role === "TECHNICIAN" && (
              <TechnicianDashboard user={user} />
            )}

            {user.role === "ADMIN" && (
              <AdminDashboard user={user} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
          <LayoutDashboard className="size-5 animate-pulse text-primary" />
        </div>

        <p className="mt-4 text-sm font-medium">
          Loading your dashboard...
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Checking your account
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

function DashboardSidebar({
  role,
  onLogout,
}: {
  role: DashboardUser["role"];
  onLogout: () => void;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 bg-background lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-border/60 p-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-black tracking-tight"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm text-primary-foreground shadow-lg shadow-primary/20">
              F
            </span>

            FixIt
            <span className="text-primary">Now</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <DashboardNavItem
            href="/dashboard"
            label="Overview"
            icon={LayoutDashboard}
            active
          />

          {role === "CUSTOMER" && (
            <>
              <DashboardNavItem
                href="/services"
                label="Browse Services"
                icon={Wrench}
              />

              <DashboardNavItem
                href="/dashboard/bookings"
                label="My Bookings"
                icon={CalendarCheck2}
              />

              <DashboardNavItem
                href="/dashboard/profile"
                label="My Profile"
                icon={CircleUserRound}
              />
            </>
          )}

          {role === "TECHNICIAN" && (
            <>
              <DashboardNavItem
                href="/dashboard/services"
                label="My Services"
                icon={BriefcaseBusiness}
              />

              <DashboardNavItem
                href="/dashboard/services/create"
                label="Create Service"
                icon={Plus}
              />

              <DashboardNavItem
                href="/dashboard/bookings"
                label="Bookings"
                icon={CalendarCheck2}
              />

              <DashboardNavItem
                href="/dashboard/profile"
                label="Technician Profile"
                icon={CircleUserRound}
              />
            </>
          )}

          {role === "ADMIN" && (
            <>
              <DashboardNavItem
                href="/dashboard/users"
                label="Users"
                icon={Users}
              />

              <DashboardNavItem
                href="/dashboard/categories"
                label="Categories"
                icon={FolderKanban}
              />

              <DashboardNavItem
                href="/dashboard/services"
                label="Services"
                icon={BriefcaseBusiness}
              />

              <DashboardNavItem
                href="/dashboard/bookings"
                label="Bookings"
                icon={CalendarCheck2}
              />
            </>
          )}

          <div className="my-4 h-px bg-border/60" />

          <DashboardNavItem
            href="/dashboard/settings"
            label="Settings"
            icon={Settings}
          />
        </nav>

        {/* User / Logout */}
        <div className="border-t border-border/60 p-4">
          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center gap-3">
              <UserAvatar user={undefined} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  Account
                </p>

                <p className="truncate text-xs capitalize text-muted-foreground">
                  {role.toLowerCase()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar Nav Item                                                           */
/* -------------------------------------------------------------------------- */

function DashboardNavItem({
  href,
  label,
  icon: Icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon
        className={`size-4 shrink-0 ${
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      />

      <span>{label}</span>

      {active && (
        <ChevronRight className="ml-auto size-3.5" />
      )}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function DashboardHeader({
  user,
}: {
  user: DashboardUser;
}) {
  return (
    <header className="border-b border-border/60">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </div>

            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user.name}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your FixItNow account from one place.
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-2">
              <ShieldCheck className="size-4 text-primary" />

              <span className="text-xs font-semibold capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>

            <UserAvatar user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Customer Dashboard                                                        */
/* -------------------------------------------------------------------------- */

function CustomerDashboard({
  user,
}: {
  user: DashboardUser;
}) {
  return (
    <div className="space-y-6 pt-6">
      {/* Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.04] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Customer account
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to get things fixed?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Find trusted professionals, book a service,
            and manage your bookings from your dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Browse Services
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/dashboard/bookings"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarCheck2}
          label="Total Bookings"
          value="—"
          description="Your service bookings"
        />

        <StatCard
          icon={ClipboardList}
          label="Active Bookings"
          value="—"
          description="Currently in progress"
        />

        <StatCard
          icon={Wrench}
          label="Completed"
          value="—"
          description="Successfully completed"
        />

        <StatCard
          icon={CircleUserRound}
          label="Account"
          value={user.status === "BANNED" ? "Banned" : "Active"}
          description="Current account status"
        />
      </div>

      {/* Quick Actions */}
      <DashboardSection
        title="Quick actions"
        description="Everything you need to manage your services."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            href="/services"
            icon={Wrench}
            title="Find a Service"
            description="Explore trusted home service professionals."
          />

          <ActionCard
            href="/dashboard/bookings"
            icon={CalendarCheck2}
            title="View Bookings"
            description="Check your current and previous bookings."
          />

          <ActionCard
            href="/dashboard/profile"
            icon={CircleUserRound}
            title="Manage Profile"
            description="Update your personal account information."
          />
        </div>
      </DashboardSection>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Technician Dashboard                                                      */
/* -------------------------------------------------------------------------- */

function TechnicianDashboard({
  user,
}: {
  user: DashboardUser;
}) {
  return (
    <div className="space-y-6 pt-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.04] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <Wrench className="size-3.5" />
            Technician account
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Grow your service business.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Create services, manage incoming bookings, and
            keep your technician profile up to date.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/services/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Create Service
            </Link>

            <Link
              href="/dashboard/services"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              My Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="My Services"
          value="—"
          description="Services you provide"
        />

        <StatCard
          icon={CalendarCheck2}
          label="Bookings"
          value="—"
          description="Incoming service requests"
        />

        <StatCard
          icon={ClipboardList}
          label="Completed"
          value="—"
          description="Completed bookings"
        />

        <StatCard
          icon={ShieldCheck}
          label="Account"
          value={user.status === "BANNED" ? "Banned" : "Active"}
          description="Current account status"
        />
      </div>

      {/* Actions */}
      <DashboardSection
        title="Manage your business"
        description="Your most important technician actions."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            href="/dashboard/services/create"
            icon={Plus}
            title="Create a Service"
            description="Add a new service customers can book."
            highlight
          />

          <ActionCard
            href="/dashboard/services"
            icon={BriefcaseBusiness}
            title="Manage Services"
            description="Edit, update or remove your services."
          />

          <ActionCard
            href="/dashboard/bookings"
            icon={CalendarCheck2}
            title="Manage Bookings"
            description="Review and manage customer requests."
          />

          <ActionCard
            href="/dashboard/profile"
            icon={CircleUserRound}
            title="Technician Profile"
            description="Keep your professional information updated."
          />
        </div>
      </DashboardSection>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin Dashboard                                                           */
/* -------------------------------------------------------------------------- */

function AdminDashboard({
  user,
}: {
  user: DashboardUser;
}) {
  return (
    <div className="space-y-6 pt-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.04] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Administrator
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Platform control center.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage users, categories, services, bookings,
            and the overall FixItNow platform.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Users"
          value="—"
          description="Registered platform users"
        />

        <StatCard
          icon={FolderKanban}
          label="Categories"
          value="—"
          description="Available service categories"
        />

        <StatCard
          icon={BriefcaseBusiness}
          label="Services"
          value="—"
          description="Platform services"
        />

        <StatCard
          icon={CalendarCheck2}
          label="Bookings"
          value="—"
          description="Platform bookings"
        />
      </div>

      {/* Management */}
      <DashboardSection
        title="Platform management"
        description="Manage the main areas of FixItNow."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            href="/dashboard/users"
            icon={Users}
            title="Users"
            description="Manage customers and technicians."
          />

          <ActionCard
            href="/dashboard/categories"
            icon={FolderKanban}
            title="Categories"
            description="Create and manage service categories."
            highlight
          />

          <ActionCard
            href="/dashboard/services"
            icon={BriefcaseBusiness}
            title="Services"
            description="Review and manage platform services."
          />

          <ActionCard
            href="/dashboard/bookings"
            icon={CalendarCheck2}
            title="Bookings"
            description="Monitor platform bookings."
          />
        </div>
      </DashboardSection>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard Section                                                         */
/* -------------------------------------------------------------------------- */

function DashboardSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <span className="text-xs text-muted-foreground">
          FixItNow
        </span>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Card                                                                */
/* -------------------------------------------------------------------------- */

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  highlight = false,
}: {
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 ${
        highlight
          ? "border-primary/20 bg-primary/[0.04]"
          : "border-border/60 bg-background hover:border-primary/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function UserAvatar({
  user,
}: {
  user?: DashboardUser;
}) {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name}
        className="size-10 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
      {user?.name?.charAt(0).toUpperCase() ?? "U"}
    </div>
  );
}