import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import RegisterForm from "@/components/auth/RegisterForm";

const benefits = [
  "Book trusted professionals for your home",
  "Choose technicians based on ratings and experience",
  "Track bookings and service progress easily",
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="relative grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 top-10 size-[34rem] rounded-full bg-primary/10 blur-[130px]" />

          <div className="absolute bottom-0 left-0 size-[28rem] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        {/* Left Side */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-2xl">
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

            {/* Register Form */}
            <RegisterForm />

            {/* Terms */}
            <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground">
              By creating an account, you agree to FixItNow&apos;s
              terms and privacy policy.
            </p>
          </div>
        </section>

        {/* Right Side */}
        <section className="relative hidden overflow-hidden border-l border-border/60 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/[0.08] via-background to-background" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <div className="flex items-center justify-between">
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

              <Link
                href="/login"
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                Sign in
              </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />

                One platform. Every fix.
              </div>

              <h1 className="text-5xl font-bold leading-[1.04] tracking-[-0.055em] xl:text-7xl">
                Your next
                <br />
                <span className="text-primary">
                  solution
                </span>
                <br />
                starts here.
              </h1>

              <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
                Whether you need a professional or you are one,
                FixItNow connects the right people with the right
                service at the right time.
              </p>

              {/* Benefits */}
              <div className="mt-9 space-y-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="size-4 text-primary" />
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Role Note */}
              <div className="mt-10 rounded-3xl border border-border/70 bg-background/50 p-5 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="size-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Choose your role carefully
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Your account type determines the dashboard,
                      features, and actions available to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="text-xs text-muted-foreground">
              <span>Built for better home services.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}