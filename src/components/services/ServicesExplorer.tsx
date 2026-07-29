"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { services } from "@/data/services";

const categories = [
  "All Categories",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Painting",
  "Appliance Repair",
  "Handyman",
];

const ratings = [
  {
    label: "Any Rating",
    value: 0,
  },
  {
    label: "4.0+ Stars",
    value: 4,
  },
  {
    label: "4.5+ Stars",
    value: 4.5,
  },
  {
    label: "4.8+ Stars",
    value: 4.8,
  },
];

const priceRanges = [
  {
    label: "Any Price",
    value: "all",
  },
  {
    label: "Under $25",
    value: "under-25",
  },
  {
    label: "$25 - $50",
    value: "25-50",
  },
  {
    label: "Above $50",
    value: "above-50",
  },
];

const sortOptions = [
  {
    label: "Recommended",
    value: "recommended",
  },
  {
    label: "Highest Rated",
    value: "rating",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
];

export default function ServicesExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [location, setLocation] = useState("");
  const [minimumRating, setMinimumRating] =
    useState(0);
  const [priceRange, setPriceRange] =
    useState("all");
  const [sortBy, setSortBy] =
    useState("recommended");

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);

  const filteredServices = useMemo(() => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    const normalizedLocation =
      location.trim().toLowerCase();

    const filtered = services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        service.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        service.category
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "All Categories" ||
        service.category === category;

      const matchesLocation =
        !normalizedLocation ||
        service.location
          .toLowerCase()
          .includes(normalizedLocation);

      const matchesRating =
        service.rating >= minimumRating;

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-25" &&
          service.price < 25) ||
        (priceRange === "25-50" &&
          service.price >= 25 &&
          service.price <= 50) ||
        (priceRange === "above-50" &&
          service.price > 50);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesRating &&
        matchesPrice
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      return b.rating - a.rating;
    });
  }, [
    searchQuery,
    category,
    location,
    minimumRating,
    priceRange,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategory("All Categories");
    setLocation("");
    setMinimumRating(0);
    setPriceRange("all");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    category !== "All Categories" ||
    location.trim() !== "" ||
    minimumRating !== 0 ||
    priceRange !== "all";

  return (
    <>
      {/* Search */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background p-2 shadow-sm transition-all duration-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search for a service..."
            className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}

          <button
            type="button"
            className="hidden h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:block"
          >
            Search
          </button>
        </div>
      </div>

      {/* Main Explorer */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-10">
          {/* Mobile Filter Button */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-sm font-medium">
                Explore Services
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredServices.length} services found
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsMobileFilterOpen(true)
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <FilterPanel
                category={category}
                setCategory={setCategory}
                location={location}
                setLocation={setLocation}
                minimumRating={minimumRating}
                setMinimumRating={setMinimumRating}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                resetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </aside>

            {/* Results */}
            <div>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Available Services
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {filteredServices.length}{" "}
                    {filteredServices.length === 1
                      ? "service"
                      : "services"}{" "}
                    available for you.
                  </p>
                </div>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {filteredServices.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  hasActiveFilters={hasActiveFilters}
                  resetFilters={resetFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setIsMobileFilterOpen(false)
            }
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-6 shadow-2xl">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-muted" />

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Refine your service search
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMobileFilterOpen(false)
                }
                className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                aria-label="Close filters"
              >
                <X className="size-4" />
              </button>
            </div>

            <FilterPanel
              category={category}
              setCategory={setCategory}
              location={location}
              setLocation={setLocation}
              minimumRating={minimumRating}
              setMinimumRating={setMinimumRating}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              type="button"
              onClick={() =>
                setIsMobileFilterOpen(false)
              }
              className="mt-6 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Show {filteredServices.length} Services
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface FilterPanelProps {
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  minimumRating: number;
  setMinimumRating: (value: number) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterPanel({
  category,
  setCategory,
  location,
  setLocation,
  minimumRating,
  setMinimumRating,
  priceRange,
  setPriceRange,
  resetFilters,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            Filters
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Refine your search
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Reset
          </button>
        )}
      </div>

      <div className="my-5 h-px bg-border" />

      {/* Category */}
      <div>
        <label
          htmlFor="service-category"
          className="text-sm font-medium"
        >
          Service Category
        </label>

        <select
          id="service-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="mt-6">
        <label
          htmlFor="service-location"
          className="text-sm font-medium"
        >
          Location
        </label>

        <input
          id="service-location"
          type="text"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          placeholder="e.g. Dhaka"
          className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {/* Rating */}
      <div className="mt-6">
        <label
          htmlFor="service-rating"
          className="text-sm font-medium"
        >
          Minimum Rating
        </label>

        <select
          id="service-rating"
          value={minimumRating}
          onChange={(event) =>
            setMinimumRating(
              Number(event.target.value),
            )
          }
          className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {ratings.map((rating) => (
            <option
              key={rating.value}
              value={rating.value}
            >
              {rating.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="mt-6">
        <label
          htmlFor="service-price"
          className="text-sm font-medium"
        >
          Price Range
        </label>

        <select
          id="service-price"
          value={priceRange}
          onChange={(event) =>
            setPriceRange(event.target.value)
          }
          className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {priceRanges.map((price) => (
            <option
              key={price.value}
              value={price.value}
            >
              {price.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

function EmptyState({
  hasActiveFilters,
  resetFilters,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Search className="size-6 text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        No services found
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasActiveFilters
          ? "We couldn't find any services matching your current filters. Try adjusting your search."
          : "There are currently no services available."}
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="mt-6 h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}