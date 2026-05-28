import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { reservations } from "@/data/reservations";
import { vehicles } from "@/data/vehicles";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/reservations")({
  component: AdminReservations,
});

const filters = ["ALL", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"] as const;
type Filter = typeof filters[number];

function AdminReservations() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const filtered = filter === "ALL" ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <header>
        <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">— Bookings</p>
        <h1 className="font-display text-4xl uppercase tracking-display mt-2">Reservations</h1>
      </header>

      <div className="mt-8 flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`hairline px-4 py-2 font-display text-[10px] uppercase tracking-wider-2 ${
              filter === f ? "bg-foreground text-background" : "text-silver hover-surface"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 hairline bg-surface-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hairline-b">
            <tr className="text-left font-display text-[10px] uppercase tracking-wider-2 text-silver">
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Pickup</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--hairline)]">
            {filtered.map((r) => {
              const v = vehicles.find((x) => x.id === r.vehicleId);
              return (
                <tr key={r.id} className="hover-surface">
                  <td className="p-4 font-mono text-xs">{r.id}</td>
                  <td className="p-4">
                    <p className="font-display uppercase tracking-display">{r.customer}</p>
                    <p className="text-xs text-silver">{r.email}</p>
                  </td>
                  <td className="p-4">{v?.brand} {v?.name}</td>
                  <td className="p-4 text-silver">{r.pickup}</td>
                  <td className="p-4 text-silver text-xs">{r.pickupDate} → {r.returnDate}</td>
                  <td className="p-4 font-display">${r.total.toLocaleString()}</td>
                  <td className="p-4"><StatusPill status={r.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
