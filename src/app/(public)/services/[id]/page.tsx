import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { services } from "@/data/services";
import { notFound } from "next/navigation";

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  const service = services.find(
    (item) => item.id === id,
  );

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />

            Back to services
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)] xl:gap-16">
            {/* Left Content */}
            <div>
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-sm">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Category */}
                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Service Info */}
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <Star className="size-4 fill-current" />

                    {service.rating.toFixed(1)}

                    <span className="font-normal text-muted-foreground">
                      ({service.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" />

                    {service.location}
                  </div>
                </div>

                <h1 className="mt-5 max-w-4xl text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  {service.title}
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {service.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <HighlightCard
                  icon={ShieldCheck}
                  title="Verified Professionals"
                  description="Trusted and verified service providers."
                />

                <HighlightCard
                  icon={Clock3}
                  title="Flexible Scheduling"
                  description="Choose a time that works for you."
                />

                <HighlightCard
                  icon={Users}
                  title="Quality Service"
                  description="Highly rated professionals near you."
                />
              </div>

              {/* About Service */}
              <div className="mt-12 border-t border-border/60 pt-10">
                <h2 className="text-2xl font-bold tracking-tight">
                  About this service
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  <p>
                    Our professional {service.category.toLowerCase()}{" "}
                    service is designed to make your life easier.
                    Whether you need a quick fix or a complete
                    service, our trusted professionals are ready
                    to help.
                  </p>

                  <p>
                    Every professional on FixItNow is selected
                    based on quality, reliability, and customer
                    satisfaction. You can choose the right
                    technician based on their skills, ratings,
                    experience, and availability.
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-12 border-t border-border/60 pt-10">
                <h2 className="text-2xl font-bold tracking-tight">
                  What&apos;s included
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    "Professional service consultation",
                    "Experienced and verified technician",
                    "Flexible appointment scheduling",
                    "Transparent pricing",
                    "Quality-focused service",
                    "Customer support assistance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="size-5 shrink-0 text-primary" />

                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-xl shadow-black/5">
                {/* Price */}
                <div className="border-b border-border/60 p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Starting from
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight">
                        ${service.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Save service"
                      className="flex size-11 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      <Heart className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Booking Content */}
                <div className="p-6 sm:p-7">
                  <h2 className="text-lg font-semibold">
                    Book this service
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Select a trusted professional and choose a
                    convenient time for your service.
                  </p>

                  {/* Date */}
                  <div className="mt-6">
                    <label
                      htmlFor="booking-date"
                      className="text-sm font-medium"
                    >
                      Preferred date
                    </label>

                    <div className="relative mt-2">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="booking-date"
                        type="date"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="mt-5">
                    <label
                      htmlFor="booking-time"
                      className="text-sm font-medium"
                    >
                      Preferred time
                    </label>

                    <div className="relative mt-2">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <select
                        id="booking-time"
                        defaultValue=""
                        className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="" disabled>
                          Select a time slot
                        </option>

                        <option value="09:00">
                          09:00 AM - 10:00 AM
                        </option>

                        <option value="10:00">
                          10:00 AM - 11:00 AM
                        </option>

                        <option value="11:00">
                          11:00 AM - 12:00 PM
                        </option>

                        <option value="14:00">
                          02:00 PM - 03:00 PM
                        </option>

                        <option value="15:00">
                          03:00 PM - 04:00 PM
                        </option>

                        <option value="16:00">
                          04:00 PM - 05:00 PM
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
                  >
                    Book a Technician
                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                    You won&apos;t be charged until your booking
                    is accepted by a technician.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

interface HighlightCardProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function HighlightCard({
  icon: Icon,
  title,
  description,
}: HighlightCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 transition-colors duration-300 hover:border-primary/20 hover:bg-primary/5">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}