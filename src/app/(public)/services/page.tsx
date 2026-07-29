
import { Search, SlidersHorizontal } from "lucide-react";

import Container from "@/components/shared/Container";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border/60 bg-muted/30">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
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
                From quick home repairs to complete maintenance,
                discover trusted professionals who are ready to
                help you get things done.
              </p>

              {/* Search */}
              <div className="mx-auto mt-8 max-w-2xl">
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background p-2 shadow-sm transition-all duration-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
                  <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />

                  <input
                    type="text"
                    placeholder="Search for a service..."
                    className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    className="hidden h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:block"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          {/* Mobile Filter Button */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-sm font-medium">
                Explore Services
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Find the perfect professional for your needs.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            {/* Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Filters
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Refine your search
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Reset
                  </button>
                </div>

                <div className="my-5 h-px bg-border" />

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="text-sm font-medium"
                  >
                    Service Category
                  </label>

                  <select
                    id="category"
                    defaultValue=""
                    className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    <option value="plumbing">
                      Plumbing
                    </option>

                    <option value="electrical">
                      Electrical
                    </option>

                    <option value="cleaning">
                      Cleaning
                    </option>

                    <option value="painting">
                      Painting
                    </option>

                    <option value="appliance">
                      Appliance Repair
                    </option>
                  </select>
                </div>

                {/* Location */}
                <div className="mt-6">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    placeholder="Enter location"
                    className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                {/* Rating */}
                <div className="mt-6">
                  <label
                    htmlFor="rating"
                    className="text-sm font-medium"
                  >
                    Minimum Rating
                  </label>

                  <select
                    id="rating"
                    defaultValue=""
                    className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">
                      Any rating
                    </option>

                    <option value="4">
                      4.0+ stars
                    </option>

                    <option value="4.5">
                      4.5+ stars
                    </option>

                    <option value="4.8">
                      4.8+ stars
                    </option>
                  </select>
                </div>

                {/* Price */}
                <div className="mt-6">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium"
                  >
                    Price Range
                  </label>

                  <select
                    id="price"
                    defaultValue=""
                    className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">
                      Any price
                    </option>

                    <option value="low">
                      Budget friendly
                    </option>

                    <option value="medium">
                      Mid range
                    </option>

                    <option value="high">
                      Premium
                    </option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div>
              {/* Results Header */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Available Services
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Browse trusted professionals near you.
                  </p>
                </div>

                <select
                  defaultValue="recommended"
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="recommended">
                    Recommended
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>
                </select>
              </div>

              {/* Empty State Placeholder */}
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Search className="size-6 text-primary" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Services are coming soon
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  We&apos;re preparing a list of trusted home
                  service professionals. Once connected to the
                  FixItNow API, available services will appear
                  here automatically.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
