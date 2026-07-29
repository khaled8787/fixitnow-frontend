import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { notFound } from "next/navigation";
import { technicians } from "@/data/technicians";

interface TechnicianProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TechnicianProfilePage({
  params,
}: TechnicianProfilePageProps) {
  const { id } = await params;

  const technician = technicians.find(
    (item) => item.id === id,
  );

  if (!technician) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top Navigation */}
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

      {/* Profile Hero */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20 2xl:px-10">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-12">
            {/* Profile Image */}
            <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-2xl shadow-black/5">
              <Image
                src={technician.image}
                alt={technician.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 340px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {technician.isAvailable && (
                <div className="absolute bottom-5 left-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-emerald-500/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                    <span className="size-2 rounded-full bg-white" />

                    Available for bookings
                  </span>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-4" />

                  Verified Technician
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="size-4 fill-current" />

                  {technician.rating.toFixed(1)} Rating
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                {technician.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />

                  {technician.location}
                </span>

                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="size-4" />

                  {technician.experience}+ years experience
                </span>

                <span className="inline-flex items-center gap-2">
                  <ThumbsUp className="size-4" />

                  {technician.completedJobs} jobs completed
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {technician.bio}
              </p>

              {/* Stats */}
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <ProfileStat
                  value={technician.rating.toFixed(1)}
                  label="Rating"
                  icon={Star}
                />

                <ProfileStat
                  value={String(technician.reviewCount)}
                  label="Reviews"
                  icon={ThumbsUp}
                />

                <ProfileStat
                  value={`${technician.experience}+`}
                  label="Years"
                  icon={Award}
                />

                <ProfileStat
                  value={String(technician.completedJobs)}
                  label="Jobs"
                  icon={BriefcaseBusiness}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-16">
            {/* Left Content */}
            <div>
              {/* Skills */}
              <section>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Skills & expertise
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  Professional skills and services this technician
                  specializes in.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {technician.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border/70 bg-muted/30 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/20 hover:bg-primary/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Why Choose */}
              <section className="mt-14 border-t border-border/60 pt-12">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Why choose {technician.name.split(" ")[0]}?
                </h2>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <BenefitCard
                    icon={ShieldCheck}
                    title="Verified professional"
                    description="Identity and professional information are verified to provide a safer booking experience."
                  />

                  <BenefitCard
                    icon={Award}
                    title="Experienced service"
                    description={`With ${technician.experience}+ years of experience, you can expect reliable and professional work.`}
                  />

                  <BenefitCard
                    icon={Star}
                    title="Highly rated"
                    description={`Rated ${technician.rating.toFixed(1)} out of 5 based on ${technician.reviewCount} customer reviews.`}
                  />

                  <BenefitCard
                    icon={Clock3}
                    title="Flexible scheduling"
                    description="Choose a convenient appointment time based on available slots."
                  />
                </div>
              </section>

              {/* Reviews */}
              <section className="mt-14 border-t border-border/60 pt-12">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Customer reviews
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground">
                      What customers are saying about this technician.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="size-5 fill-amber-500 text-amber-500" />

                    <span className="text-xl font-bold">
                      {technician.rating.toFixed(1)}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      ({technician.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <ReviewCard
                    name="Nusrat Jahan"
                    rating={5}
                    date="2 weeks ago"
                    text="Very professional and punctual. The service quality was excellent and the entire booking process was smooth."
                  />

                  <ReviewCard
                    name="Fahim Rahman"
                    rating={5}
                    date="1 month ago"
                    text="Really happy with the service. The technician was friendly, skilled, and completed everything on time."
                  />

                  <ReviewCard
                    name="Mim Akter"
                    rating={4}
                    date="2 months ago"
                    text="Good experience overall. Communication was easy and the work was completed professionally."
                  />
                </div>
              </section>
            </div>

            {/* Booking Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-xl shadow-black/5">
                {/* Price */}
                <div className="border-b border-border/60 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Starting rate
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight">
                        ${technician.hourlyRate}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          /hour
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Save technician"
                      className="flex size-11 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      <Heart className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Booking */}
                <div className="p-6 sm:p-7">
                  <h2 className="text-lg font-semibold">
                    Book {technician.name.split(" ")[0]}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Choose a service and preferred schedule to
                    request a booking.
                  </p>

                  {/* Service */}
                  <div className="mt-6">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium"
                    >
                      Select service
                    </label>

                    <select
                      id="service"
                      defaultValue=""
                      className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="" disabled>
                        Choose a service
                      </option>

                      {technician.skills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="mt-5">
                    <label
                      htmlFor="profile-booking-date"
                      className="text-sm font-medium"
                    >
                      Preferred date
                    </label>

                    <div className="relative mt-2">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <input
                        id="profile-booking-date"
                        type="date"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/services?technician=${technician.id}`}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
                  >
                    Continue Booking

                    <ArrowRight className="size-4" />
                  </Link>

                  <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                    You won&apos;t be charged until your booking
                    is accepted.
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

interface ProfileStatProps {
  value: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

function ProfileStat({
  value,
  label,
  icon: Icon,
}: ProfileStatProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4">
      <Icon className="size-4 text-primary" />

      <p className="mt-3 text-xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

interface BenefitCardProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-primary/5">
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  text: string;
}

function ReviewCard({
  name,
  rating,
  date,
  text,
}: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">
            {name}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {date}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`size-3.5 ${
                index < rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}