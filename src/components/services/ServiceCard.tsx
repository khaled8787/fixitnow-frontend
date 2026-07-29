import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Star,
} from "lucide-react";

import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border/60 bg-background transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <Link
        href={`/services/${service.id}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {service.category}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/services/${service.id}`}>
              <h3 className="truncate text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {service.title}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />

              <span className="truncate">
                {service.location}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Star className="size-3.5 fill-current" />

            {service.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-xs text-muted-foreground">
              Starting from
            </span>

            <p className="mt-0.5 text-lg font-bold">
              ${service.price}
            </p>
          </div>

          <span className="text-xs text-muted-foreground">
            {service.reviewCount} reviews
          </span>
        </div>
      </div>
    </article>
  );
}