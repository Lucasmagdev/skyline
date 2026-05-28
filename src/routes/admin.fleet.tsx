import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wrench } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/fleet")({
  component: AdminFleet,
});

function AdminFleet() {
  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">— Inventory</p>
          <h1 className="font-display text-4xl uppercase tracking-display mt-2">Fleet management</h1>
        </div>
        <button className="inline-flex items-center gap-2 bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add vehicle
        </button>
      </header>

      <div className="mt-10 hairline bg-surface-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hairline-b">
            <tr className="text-left font-display text-[10px] uppercase tracking-wider-2 text-silver">
              <th className="p-4">Vehicle</th>
              <th className="p-4">Plate</th>
              <th className="p-4">Category</th>
              <th className="p-4">Mileage</th>
              <th className="p-4">Price/day</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--hairline)]">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover-surface">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={v.image} alt="" className="h-10 w-16 object-cover hairline" />
                    <div>
                      <p className="font-display uppercase tracking-display">{v.name}</p>
                      <p className="text-xs text-silver">{v.brand} · {v.year}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs text-silver">{v.plate}</td>
                <td className="p-4 text-silver">{v.category}</td>
                <td className="p-4 text-silver">{v.mileage.toLocaleString()} km</td>
                <td className="p-4 font-display">${v.pricePerDay}</td>
                <td className="p-4"><StatusPill status={v.status} /></td>
                <td className="p-4 text-right">
                  <Link
                    to="/maintenance/$vehicleId"
                    params={{ vehicleId: v.id }}
                    className="inline-flex items-center gap-1.5 hairline px-3 py-1.5 font-display text-[10px] uppercase tracking-wider-2 hover-surface"
                  >
                    <Wrench className="h-3 w-3" /> Checklist
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
