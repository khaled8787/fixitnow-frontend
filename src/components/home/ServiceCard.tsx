"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Star } from "lucide-react";
import { motion } from "framer-motion";

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  duration: string;
}

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({
  service,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Image */}
      <Link
        href={`/services/${service.id}`}
        className="relative block aspect-4/3 overflow-hidden"
      >
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-80" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {service.category}
          </span>
        </div>

        {/* Arrow */}
        <div className="absolute right-4 top-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />

          <span>{service.rating.toFixed(1)}</span>

          <span className="text-white/60">
            ({service.reviewCount})
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/services/${service.id}`}>
              <h3 className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {service.name}
              </h3>
            </Link>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Starting from
            </p>

            <p className="mt-1 text-lg font-bold tracking-tight">
              ${service.startingPrice}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />

            {service.duration}
          </div>
        </div>
      </div>
    </motion.article>
  );
}