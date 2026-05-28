import { Users, Fuel, Gauge } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  pricePerDay: number;
  transmission: string;
  seats: number;
  horsepower: number;
  status: VehicleStatus;
}

const statusStyles: Record<VehicleStatus, string> = {
  AVAILABLE: "text-success border-success/40 bg-success/5",
  RENTED: "text-warning border-warning/40 bg-warning/5",
  MAINTENANCE: "text-danger border-danger/40 bg-danger/5",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group hairline hover-surface relative flex flex-col overflow-hidden bg-card">
      {/* Status badge */}
      <div className="absolute left-4 top-4 z-10">
        <span
          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-display text-[10px] uppercase tracking-wider-2 ${statusStyles[vehicle.status]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {vehicle.status}
        </span>
      </div>

      {/* Category tag */}
      <div className="absolute right-4 top-4 z-10">
        <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
          {vehicle.category}
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-1">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.name}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="hairline-b pb-4">
          <p className="font-display text-[11px] uppercase tracking-wider-2 text-silver">
            {vehicle.brand}
          </p>
          <h3 className="font-display text-xl uppercase tracking-display text-foreground mt-1">
            {vehicle.name}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3 py-4">
          <Spec icon={<Gauge className="h-3.5 w-3.5" />} label={`${vehicle.horsepower} HP`} />
          <Spec icon={<Fuel className="h-3.5 w-3.5" />} label={vehicle.transmission} />
          <Spec icon={<Users className="h-3.5 w-3.5" />} label={`${vehicle.seats} seats`} />
        </div>

        <div className="hairline-t mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">From</p>
            <p className="font-display text-2xl text-foreground leading-none mt-1">
              ${vehicle.pricePerDay}
              <span className="text-sm text-silver ml-1">/day</span>
            </p>
          </div>
          <Link
            to="/fleet/$id"
            params={{ id: vehicle.id }}
            className="bg-foreground px-4 py-2.5 font-display text-[11px] uppercase tracking-wider-2 text-background transition-opacity hover:opacity-90"
          >
            {vehicle.status === "AVAILABLE" ? "Reserve" : "View"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="text-silver">{icon}</span>
      <span className="font-display text-[11px] uppercase tracking-wider-2 text-foreground">
        {label}
      </span>
    </div>
  );
}
