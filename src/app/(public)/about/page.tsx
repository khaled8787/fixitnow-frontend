import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Verified Professionals",
    description:
      "Connect with skilled and trusted technicians who are ready to handle your home service needs.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    description:
      "Your bookings are handled through a structured platform designed for a safer service experience.",
  },
  {
    icon: Clock3,
    title: "Flexible Scheduling",
    description:
      "Choose a convenient date and time that works for you instead of waiting around for a technician.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Complete your service payment through a secure and transparent payment process.",
  },
  {
    icon: Headphones,
    title: "Customer Focused",
    description:
      "We keep the experience simple so you can focus on getting your home fixed without unnecessary hassle.",
  },
  {
    icon: Zap,
    title: "Fast Service",
    description:
      "Find the right professional quickly and move from discovery to booking with less friction.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse the services you need and explore professionals available for the job.",
  },
  {
    number: "02",
    title: "Choose Your Technician",
    description:
      "Compare technician profiles, skills, experience, ratings and availability.",
  },
  {
    number: "03",
    title: "Book Your Service",
    description:
      "Select your preferred date, time and location, then submit your booking request.",
  },
  {
    number: "04",
    title: "Get It Done",
    description:
      "Once your request is accepted and payment is completed, your service journey begins.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <section className="relative isolate min-h-[720px] overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_10%_70%,hsl(var(--primary)/0.08),transparent_28%),radial-gradient(circle_at_90%_60%,hsl(var(--primary)/0.08),transparent_30%)]" />

        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[8%] top-32 size-32 rounded-[2rem] border border-primary/20 bg-primary/5 shadow-[0_0_80px_hsl(var(--primary)/0.15)] [transform:perspective(800px)_rotateX(55deg)_rotateZ(35deg)] animate-[float_7s_ease-in-out_infinite]" />

          <div className="absolute right-[8%] top-40 size-24 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_70px_hsl(var(--primary)/0.18)] animate-[float_5s_ease-in-out_infinite_reverse]" />

          <div className="absolute bottom-20 left-[18%] size-16 rounded-xl border border-primary/15 bg-primary/5 [transform:rotate(45deg)] animate-[spin-slow_14s_linear_infinite]" />

          <div className="absolute bottom-24 right-[18%] h-24 w-24 rounded-3xl border border-primary/20 bg-primary/5 [transform:perspective(500px)_rotateX(55deg)_rotateY(-35deg)] animate-[float_6s_ease-in-out_infinite]" />
        </div>

        <div className="absolute inset-0 -z-10 opacity-[0.045] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="size-3.5" />
              The smarter way to get things fixed
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              Your Home.
              <span className="block bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
                Our Expertise.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              FixItNow connects homeowners with skilled professionals through
              a simple, reliable and modern home service experience.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-bold text-primary-foreground shadow-[0_15px_50px_hsl(var(--primary)/0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90"
              >
                Explore Services
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/technicians"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-border bg-background/60 px-7 text-sm font-bold backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-muted"
              >
                Meet Our Technicians
                <Users className="size-4" />
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6">
              {[
                ["Trusted", "Professionals"],
                ["Simple", "Booking"],
                ["Secure", "Payments"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border/60 bg-background/50 p-4 shadow-xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2"
                >
                  <p className="text-sm font-bold sm:text-base">{title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                    {subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative flex min-h-[480px] items-center justify-center">
            <div className="absolute size-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative h-72 w-72 [perspective:1000px] sm:h-80 sm:w-80">
              <div className="absolute inset-0 rounded-[3rem] border border-primary/20 bg-primary/5 shadow-[0_30px_100px_hsl(var(--primary)/0.15)] [transform:rotateX(58deg)_rotateZ(35deg)] animate-[cube-float_7s_ease-in-out_infinite]" />

              <div className="absolute inset-10 rounded-[2rem] border border-border/70 bg-background/70 shadow-2xl backdrop-blur-xl [transform:translateZ(70px)_rotateX(8deg)_rotateY(-8deg)]">
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                    <Wrench className="size-8" />
                  </div>

                  <p className="mt-5 text-lg font-black">FixItNow</p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Connecting people with the right professionals.
                  </p>

                  <div className="mt-6 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="size-3.5 fill-current text-amber-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <BadgeCheck className="size-3.5" />
              Built around trust
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Home services should feel
              <span className="text-primary"> effortless.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
              Finding a reliable professional should not mean calling multiple
              people, comparing random recommendations or wondering whether
              someone will actually show up. FixItNow brings the entire
              experience into one organized platform.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Discover professionals based on your needs",
                "Review technician expertise and availability",
                "Schedule your preferred service time",
                "Manage bookings from one place",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Why FixItNow
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Everything you need.
              <span className="block text-muted-foreground">
                Nothing you don't.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Designed to make finding, booking and managing home services
              easier from the first click to the final service.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>

                    <span className="mt-7 block text-xs font-bold text-primary">
                      0{index + 1}
                    </span>

                    <h3 className="mt-2 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              How it works
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              From problem to solution.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              A straightforward journey designed around your convenience.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-border lg:block" />

            <div className="grid gap-8 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-background text-sm font-black text-primary shadow-xl">
                    {step.number}
                  </div>

                  <h3 className="mt-6 text-lg font-bold">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>

                  <ChevronRight className="mx-auto mt-5 hidden size-4 text-primary/50 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary px-6 py-16 text-primary-foreground shadow-[0_30px_100px_hsl(var(--primary)/0.25)] sm:px-12 sm:py-20">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-black/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
              <Wrench className="size-7" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
              Ready to fix what matters?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
              Explore our services, find a trusted professional and get your
              next home project moving.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
              >
                Browse Services
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/technicians"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                Find a Technician
                <Users className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(8deg);
          }
        }

        @keyframes cube-float {
          0%, 100% {
            transform: rotateX(58deg) rotateZ(35deg) translateY(0);
          }
          50% {
            transform: rotateX(63deg) rotateZ(39deg) translateY(-18px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(405deg);
          }
        }
      `}</style>
    </main>
  );
}