
import ServicesExplorer from "@/components/services/ServicesExplorer";
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Find the right professional
              </span>

              <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Services that make
                <span className="text-primary">
                  {" "}
                  life easier.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
                From quick home repairs to complete
                maintenance, discover trusted professionals
                who are ready to help you get things done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Explorer */}
      <ServicesExplorer />
    </main>
  );
}
