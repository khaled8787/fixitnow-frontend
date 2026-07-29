import ServiceCard from "@/components/services/ServiceCard";
import { services } from "@/data/services";

export default function ServiceGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  );
}