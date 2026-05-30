import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import { InternalAccessPrompt } from "@/components/InternalAccessPrompt";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useFleetData } from "@/contexts/FleetDataContext";
import { useLocale } from "@/contexts/LocaleContext";
import { ChecklistState, checklistItems, stateOrder, stateTransitions } from "@/data/checklist";

export const Route = createFileRoute("/maintenance/$vehicleId")({
  head: () => ({
    meta: [{ title: "Skyline maintenance checklist" }, { name: "robots", content: "noindex" }],
  }),
  component: ChecklistPage,
  notFoundComponent: ChecklistNotFound,
  errorComponent: ChecklistError,
});

type ItemState = "pending" | "ok" | "fail";
const initialChecklistItems = Object.fromEntries(
  checklistItems.map((item) => [item.id, "pending" as ItemState]),
);

function ChecklistPage() {
  const { vehicleId } = Route.useParams();
  const { canAccessMaintenance } = useAuth();
  const { vehicles, updateVehicleStatus } = useFleetData();
  const { formatNumber, t } = useLocale();
  const vehicle = vehicles.find((item) => item.id === vehicleId);
  const storageKey = `skyline-drive-hub:checklist:${vehicleId}`;
  const [state, setState] = useState<ChecklistState>("PENDING");
  const [items, setItems] = useState<Record<string, ItemState>>(initialChecklistItems);
  const [notes, setNotes] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const groups = useMemo(() => {
    const g: Record<string, typeof checklistItems> = {};
    for (const item of checklistItems) (g[item.group] ||= []).push(item);
    return g;
  }, []);

  const failCount = Object.values(items).filter((v) => v === "fail").length;
  const okCount = Object.values(items).filter((v) => v === "ok").length;
  const allChecked = okCount + failCount === checklistItems.length;

  const canTransitionTo = stateTransitions[state];

  useEffect(() => {
    try {
      setState("PENDING");
      setItems(initialChecklistItems);
      setNotes("");

      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const stored = JSON.parse(raw) as {
        state?: ChecklistState;
        items?: Record<string, ItemState>;
        notes?: string;
      };

      if (stored.state && stateTransitions[stored.state]) setState(stored.state);
      if (stored.items) setItems((current) => ({ ...current, ...stored.items }));
      if (typeof stored.notes === "string") setNotes(stored.notes);
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ state, items, notes }));
  }, [hydrated, items, notes, state, storageKey]);

  if (!canAccessMaintenance) {
    return (
      <InternalAccessPrompt
        title={t("access.maintenanceTitle")}
        description={t("access.maintenanceDescription")}
        returnTo={`/maintenance/${vehicleId}`}
      />
    );
  }

  if (!vehicle) {
    return <ChecklistNotFound />;
  }

  function setItem(id: string, value: ItemState) {
    if (state !== "IN_PROGRESS") return;
    setItems((prev) => ({ ...prev, [id]: value }));
  }

  function transition(next: ChecklistState) {
    if (!vehicle) return;
    // Guard: AWAITING_REVIEW requires all items checked
    if (next === "AWAITING_REVIEW" && !allChecked) return;
    setState(next);

    if (
      next === "IN_PROGRESS" ||
      next === "AWAITING_REVIEW" ||
      next === "REJECTED" ||
      next === "IN_REPAIR"
    ) {
      updateVehicleStatus(vehicle.id, "MAINTENANCE");
    }
    if (next === "RELEASED") {
      updateVehicleStatus(vehicle.id, "AVAILABLE");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12">
        <Link
          to="/maintenance"
          className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> {t("maintenance.back")}
        </Link>

        <header className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="flex items-center gap-5">
            <img src={vehicle.image} alt="" className="hairline w-32 h-24 object-cover" />
            <div>
              <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                {vehicle.plate} · {formatNumber(vehicle.mileage)} km
              </p>
              <h1 className="font-display text-3xl md:text-4xl uppercase tracking-display mt-1">
                {vehicle.brand} {vehicle.name}
              </h1>
            </div>
          </div>
          <div className="hairline bg-surface-1 px-5 py-3">
            <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
              {t("maintenance.currentState")}
            </p>
            <p className="font-display text-xl uppercase tracking-display mt-1">
              {t(`maintenance.state.${state}`)}
            </p>
          </div>
        </header>

        {/* State machine bar */}
        <div className="mt-8 hairline bg-surface-1 p-5">
          <div className="flex items-center justify-between overflow-x-auto gap-3">
            {stateOrder.map((s, i) => {
              const reached =
                stateOrder.indexOf(state as ChecklistState) >= i ||
                state === "REJECTED" ||
                state === "IN_REPAIR";
              const isCurrent = state === s;
              return (
                <div key={s} className="flex items-center gap-3 shrink-0">
                  <div
                    className={`flex items-center gap-2 ${isCurrent ? "text-foreground" : reached ? "text-silver" : "text-silver/40"}`}
                  >
                    <span
                      className={`h-6 w-6 hairline flex items-center justify-center font-display text-[10px] ${isCurrent ? "bg-foreground text-background" : ""}`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-display text-[10px] uppercase tracking-wider-2">
                      {t(`maintenance.state.${s}`)}
                    </span>
                  </div>
                  {i < stateOrder.length - 1 && (
                    <span className="h-px w-6 bg-[color:var(--hairline)]" />
                  )}
                </div>
              );
            })}
          </div>
          {(state === "REJECTED" || state === "IN_REPAIR") && (
            <p className="mt-4 hairline bg-danger/5 text-danger font-display text-xs uppercase tracking-wider-2 px-3 py-2 inline-flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" /> {t("maintenance.diverted")}
            </p>
          )}
        </div>

        {state === "PENDING" ? (
          <div className="mt-8 hairline bg-surface-1 p-10 md:p-14 flex flex-col items-center text-center max-w-xl mx-auto">
            <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
              {t("maintenance.pendingEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase tracking-display">
              {t("maintenance.pendingTitle")}
            </h2>
            <p className="mt-4 text-sm text-silver leading-relaxed max-w-sm">
              {t("maintenance.pendingCopy", { count: checklistItems.length })}
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px hairline w-full">
              {Object.entries(groups).map(([group, list]) => (
                <div key={group} className="bg-surface-1 p-4">
                  <p className="font-display text-xl">{list.length}</p>
                  <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver mt-1">
                    {t(`maintenance.group.${group}`)}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => transition("IN_PROGRESS")}
              className="mt-10 w-full bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90 transition-opacity"
            >
              → {t("maintenance.state.IN_PROGRESS")}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Checklist */}
            <div className="space-y-8">
              {Object.entries(groups).map(([group, list]) => (
                <section key={group} className="hairline bg-surface-1">
                  <h3 className="font-display uppercase tracking-display p-5 hairline-b">
                    {t(`maintenance.group.${group}`)}
                  </h3>
                  <ul className="divide-y divide-[color:var(--hairline)]">
                    {list.map((item) => {
                      const v = items[item.id];
                      return (
                        <li key={item.id} className="flex items-center justify-between p-4 gap-4">
                          <span className="text-sm">{t(`maintenance.item.${item.id}`)}</span>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => setItem(item.id, "ok")}
                              disabled={state !== "IN_PROGRESS"}
                              className={`h-9 w-9 hairline flex items-center justify-center transition-colors ${
                                v === "ok"
                                  ? "bg-success/20 text-success border-success/40"
                                  : "text-silver hover-surface"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              aria-label={t("maintenance.pass")}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setItem(item.id, "fail")}
                              disabled={state !== "IN_PROGRESS"}
                              className={`h-9 w-9 hairline flex items-center justify-center transition-colors ${
                                v === "fail"
                                  ? "bg-danger/20 text-danger border-danger/40"
                                  : "text-silver hover-surface"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              aria-label={t("maintenance.fail")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              <section className="hairline bg-surface-1 p-5">
                <label className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                  {t("maintenance.notes")}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={state === "RELEASED"}
                  placeholder={t("maintenance.notesPlaceholder")}
                  rows={4}
                  className="mt-2 w-full bg-background hairline p-3 text-sm focus:outline-none focus:border-foreground"
                />
              </section>
            </div>

            {/* Action panel */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="hairline bg-surface-1 p-5">
                <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                  {t("maintenance.progress")}
                </p>
                <p className="font-display text-3xl mt-1">
                  {okCount + failCount}
                  <span className="text-silver text-base">/{checklistItems.length}</span>
                </p>
                <div className="mt-2 flex gap-3 text-xs font-display uppercase tracking-wider-2">
                  <span className="text-success">
                    {okCount} {t("maintenance.pass")}
                  </span>
                  <span className="text-danger">
                    {failCount} {t("maintenance.fail")}
                  </span>
                </div>

                <div className="mt-6 hairline-t pt-5 space-y-2">
                  <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                    {t("maintenance.nextActions")}
                  </p>
                  {canTransitionTo.length === 0 && (
                    <p className="text-xs text-silver">{t("maintenance.complete")}</p>
                  )}
                  {canTransitionTo.map((next) => {
                    const blocked = next === "AWAITING_REVIEW" && !allChecked;
                    const danger = next === "REJECTED" || next === "IN_REPAIR";
                    return (
                      <button
                        key={next}
                        onClick={() => transition(next)}
                        disabled={blocked}
                        className={`w-full px-4 py-3 font-display text-[11px] uppercase tracking-wider-2 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed ${
                          danger
                            ? "bg-danger text-white hover:opacity-90"
                            : "bg-foreground text-background hover:opacity-90"
                        }`}
                      >
                        → {t(`maintenance.state.${next}`)}
                      </button>
                    );
                  })}
                  {state === "IN_PROGRESS" && !allChecked && (
                    <p className="text-[10px] text-silver mt-2">
                      {t("maintenance.checkEveryItem")}
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function ChecklistNotFound() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center">
        <p className="font-display uppercase tracking-wider-2 text-silver text-xs">404</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-display">
          {t("maintenance.notFound")}
        </h1>
        <Link
          to="/maintenance"
          className="mt-6 inline-block hairline px-5 py-3 font-display text-xs uppercase tracking-wider-2 hover-surface"
        >
          {t("maintenance.back")}
        </Link>
      </div>
    </main>
  );
}

function ChecklistError() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-silver">{t("maintenance.error")}</p>
    </div>
  );
}
