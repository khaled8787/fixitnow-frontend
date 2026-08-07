import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Wrench,
  XCircle,
} from "lucide-react";

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
  description?: string | null;
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

async function getTechnician(id: string): Promise<Technician | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  try {
    const response = await fetch(
      `${baseUrl}/api/api/technicians/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const result: ApiResponse<Technician> =
      await response.json();

    return result.data ?? null;
  } catch (error) {
    console.error("GET TECHNICIAN ERROR:", error);
    return null;
  }
}

function formatRating(
  rating?: number | string | null,
) {
  if (
    rating === null ||
    rating === undefined ||
    !Number.isFinite(Number(rating))
  ) {
    return "New";
  }

  return Number(rating).toFixed(1);
}

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const technician = await getTechnician(id);

  if (!technician) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <User className="size-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Technician Not Found
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The technician you're looking for doesn't exist
            or is no longer available.
          </p>

          <Link
            href="/technicians"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Back to Technicians
          </Link>
        </section>
      </main>
    );
  }

  const user = technician.user;

  const rating =
    technician.rating !== null &&
    technician.rating !== undefined
      ? Number(technician.rating)
      : null;

  const skills = Array.isArray(technician.skills)
    ? technician.skills
    : [];

  const services = Array.isArray(technician.services)
    ? technician.services
    : [];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/technicians"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to Technicians
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-primary/10 text-primary ring-8 ring-background shadow-xl">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Technician"}
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-12" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {user?.name ||
                      "Professional Technician"}
                  </h1>

                  {technician.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-muted-foreground" />
                      Unavailable
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Trusted home service professional
                </p>

                {technician.location && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-primary" />
                    {technician.location}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center shadow-sm">
                <BriefcaseBusiness className="mx-auto size-5 text-primary" />

                <p className="mt-2 text-lg font-bold">
                  {technician.experience ?? 0}
                </p>

                <p className="text-xs text-muted-foreground">
                  Years Experience
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4 text-center shadow-sm">
                <Star className="mx-auto size-5 fill-current text-amber-500" />

                <p className="mt-2 text-lg font-bold">
                  {formatRating(rating)}
                </p>

                <p className="text-xs text-muted-foreground">
                  Rating
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-border/60 bg-background p-4 text-center shadow-sm sm:col-span-1">
                <Wrench className="mx-auto size-5 text-primary" />

                <p className="mt-2 text-lg font-bold">
                  {services.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <div className="space-y-6">
            <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">
                About Technician
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {technician.bio ||
                  "This technician has not added a biography yet."}
              </p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Skills & Expertise
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Areas this technician specializes in
                  </p>
                </div>

                <Wrench className="size-6 text-primary" />
              </div>

              {skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-border bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground">
                  No skills have been listed yet.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Services
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Services provided by this technician
                  </p>
                </div>

                <Wrench className="size-6 text-primary" />
              </div>

              {services.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="block rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold">
                            {service.title}
                          </h3>

                          {service.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {service.description}
                            </p>
                          )}
                        </div>

                        {service.price !== undefined && (
                          <span className="shrink-0 text-sm font-bold text-primary">
                            ৳{service.price}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground">
                  No services are currently listed.
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">
                Contact Information
              </h2>

              <div className="mt-6 space-y-4">
                {user?.email && (
                  <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {user?.phone && (
                  <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="size-4" />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                )}

                {technician.location && (
                  <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="size-4" />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {technician.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                {technician.isAvailable ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                )}

                <div>
                  <p className="text-sm font-bold">
                    {technician.isAvailable
                      ? "Currently Available"
                      : "Currently Unavailable"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {technician.isAvailable
                      ? "This technician is currently available for service requests."
                      : "This technician is currently not accepting new service requests."}
                  </p>
                </div>
              </div>
            </section>

            {services.length > 0 && technician.isAvailable && (
              <Link
                href={`/services/${services[0].id}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                Book a Service
              </Link>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}