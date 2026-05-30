import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, ArrowRight, ArrowLeft } from "lucide-react";
import { useFleetData } from "@/contexts/FleetDataContext";
import { SiteHeader } from "@/components/SiteHeader";
import { InternalAccessPrompt } from "@/components/InternalAccessPrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

export const Route = createFileRoute("/maintenance/")({
  head: () => ({
    meta: [{ title: "Skyline — Maintenance" }, { name: "robots", content: "noindex" }],
  }),
  component: MaintenanceList,
});

function MaintenanceList() {
  const { vehicles } = useFleetData();
  const { canAccessMaintenance } = useAuth();
  const { formatNumber, t } = useLocale();

  if (!canAccessMaintenance) {
    return (
      <InternalAccessPrompt
        title={t("access.maintenanceTitle")}
        description={t("access.maintenanceDescription")}
        returnTo="/maintenance"
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> {t("common.admin")}
        </Link>
        <header className="mt-6 flex items-center gap-3">
          <Wrench className="h-6 w-6 text-danger" />
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-display">
            {t("maintenance.title")}
          </h1>
        </header>
        <p className="text-silver mt-3 max-w-2xl">{t("maintenance.copy")}</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Link
              key={v.id}
              to="/maintenance/$vehicleId"
              params={{ vehicleId: v.id }}
              className="hairline hover-surface bg-surface-1 overflow-hidden group flex"
            >
              <img src={v.image} alt="" className="w-32 h-32 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                  {v.plate}
                </p>
                <p className="font-display uppercase tracking-display mt-1">
                  {v.brand} {v.name}
                </p>
                <p className="text-xs text-silver mt-1">{formatNumber(v.mileage)} km</p>
                <span className="mt-auto inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-foreground self-end">
                  {t("maintenance.open")}{" "}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
