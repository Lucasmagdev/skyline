import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Car, DollarSign, TrendingUp, Users } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { reservations } from "@/data/reservations";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const active = reservations.filter((r) => r.status === "ACTIVE").length;
  const confirmed = reservations.filter((r) => r.status === "CONFIRMED").length;
  const revenue = reservations
    .filter((r) => r.status !== "CANCELLED")
    .reduce((s, r) => s + r.total, 0);
  const available = vehicles.filter((v) => v.status === "AVAILABLE").length;

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <header>
        <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">— Overview</p>
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-display mt-2">Operations dashboard</h1>
        <p className="text-silver mt-2">Real-time view of fleet, bookings and revenue.</p>
      </header>

      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<DollarSign className="h-4 w-4" />} label="Revenue (period)" value={`$${revenue.toLocaleString()}`} trend="+12.4%" />
        <Stat icon={<Car className="h-4 w-4" />} label="Vehicles available" value={`${available}/${vehicles.length}`} trend="−1" />
        <Stat icon={<Users className="h-4 w-4" />} label="Active rentals" value={`${active}`} trend="+2" />
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="Confirmed upcoming" value={`${confirmed}`} trend="+5" />
      </div>

      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 hairline bg-surface-1">
          <div className="flex items-center justify-between p-5 hairline-b">
            <h2 className="font-display uppercase tracking-display">Recent reservations</h2>
            <Link to="/admin/reservations" className="font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-[color:var(--hairline)]">
            {reservations.slice(0, 5).map((r) => {
              const v = vehicles.find((x) => x.id === r.vehicleId);
              return (
                <li key={r.id} className="p-5 flex items-center gap-4 hover-surface">
                  <img src={v?.image} alt="" className="h-12 w-16 object-cover hairline" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display uppercase tracking-display truncate">{r.customer}</p>
                    <p className="text-xs text-silver truncate">{v?.brand} {v?.name} · {r.id}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-display text-sm">${r.total.toLocaleString()}</p>
                    <p className="text-[10px] text-silver">{r.pickupDate}</p>
                  </div>
                  <StatusPill status={r.status} />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hairline bg-surface-1 p-5">
          <h2 className="font-display uppercase tracking-display">Fleet status</h2>
          <ul className="mt-5 space-y-3">
            {vehicles.map((v) => (
              <li key={v.id} className="flex items-center justify-between">
                <span className="flex items-center gap-3 min-w-0">
                  <img src={v.image} alt="" className="h-8 w-12 object-cover hairline" />
                  <span className="truncate font-display text-sm uppercase tracking-display">{v.name}</span>
                </span>
                <StatusPill status={v.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="hairline bg-surface-1 p-5">
      <div className="flex items-center justify-between text-silver">
        <span>{icon}</span>
        <span className="font-display text-[10px] uppercase tracking-wider-2 text-success">{trend}</span>
      </div>
      <p className="mt-4 font-display text-3xl">{value}</p>
      <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver mt-1">{label}</p>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "text-success border-success/40",
    RENTED: "text-warning border-warning/40",
    MAINTENANCE: "text-danger border-danger/40",
    ACTIVE: "text-warning border-warning/40",
    CONFIRMED: "text-success border-success/40",
    COMPLETED: "text-silver border-[color:var(--hairline)]",
    CANCELLED: "text-danger border-danger/40",
  };
  return (
    <span className={`shrink-0 inline-flex items-center gap-1.5 border px-2 py-1 font-display text-[9px] uppercase tracking-wider-2 ${styles[status] ?? ""}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
