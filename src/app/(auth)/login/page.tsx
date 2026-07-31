import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

const benefits = [
  "Book trusted home service professionals",
  "Track your bookings in real time",
  "Manage everything from one dashboard",
];

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="relative grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 size-[28rem] rounded-full bg-primary/10 blur-[120px]" />

          <div className="absolute right-0 top-0 size-[32rem] rounded-full bg-primary/5 blur-[130px]" />
        </div>

        {/* Left Panel */}
        <section className="relative hidden overflow-hidden border-r border-border/60 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-background" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <div>
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

            {/* Main Message */}
            <div className="max-w-lg">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />

                Your home, handled better.
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.055em] xl:text-7xl">
                Get things
                <br />
                <span className="text-primary">
                  fixed.
                </span>
                <br />
                Without the hassle.
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
                Find reliable professionals for the jobs that
                matter. From quick repairs to complete home
                services, FixItNow keeps everything simple.
              </p>

              {/* Benefits */}
              <div className="mt-9 space-y-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />

                    <span className="text-muted-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />

              Secure account access
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-black tracking-tight"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
                  F
                </span>

                FixIt
                <span className="text-primary">Now</span>
              </Link>

              <Link
                href="/"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Back to home"
              >
                <ArrowLeft className="size-4" />
              </Link>
            </div>

            {/* Form */}
            <LoginForm />

            {/* Bottom Note */}
            <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground">
              By continuing, you agree to FixItNow&apos;s
              terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}