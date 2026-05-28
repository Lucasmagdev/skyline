import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getVehicleById } from "@/data/vehicles";
import {
  ChecklistState,
  checklistItems,
  stateLabel,
  stateOrder,
  stateTransitions,
} from "@/data/checklist";

export const Route = createFileRoute("/maintenance/$vehicleId")({
  loader: ({ params }) => {
    const vehicle = getVehicleById(params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Checklist — ${loaderData?.vehicle.name ?? "Vehicle"}` }, { name: "robots", content: "noindex" }],
  }),
  component: ChecklistPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Link to="/maintenance" className="font-display uppercase tracking-wider-2 text-xs text-silver hover:text-foreground">
        ← Back to maintenance
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-silver">Error loading checklist.</p>
    </div>
  ),
});

type ItemState = "pending" | "ok" | "fail";

function ChecklistPage() {
  const { vehicle } = Route.useLoaderData();
  const [state, setState] = useState<ChecklistState>("PENDING");
  const [items, setItems] = useState<Record<string, ItemState>>(
    Object.fromEntries(checklistItems.map((i) => [i.id, "pending" as ItemState])),
  );
  const [notes, setNotes] = useState("");

  const groups = useMemo(() => {
    const g: Record<string, typeof checklistItems> = {};
    for (const item of checklistItems) (g[item.group] ||= []).push(item);
    return g;
  }, []);

  const failCount = Object.values(items).filter((v) => v === "fail").length;
  const okCount = Object.values(items).filter((v) => v === "ok").length;
  const allChecked = okCount + failCount === checklistItems.length;

  const canTransitionTo = stateTransitions[state];

  function setItem(id: string, value: ItemState) {
    if (state !== "IN_PROGRESS") return;
    setItems((prev) => ({ ...prev, [id]: value }));
  }

  function transition(next: ChecklistState) {
    // Guard: AWAITING_REVIEW requires all items checked
    if (next === "AWAITING_REVIEW" && !allChecked) return;
    setState(next);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12">
        <Link to="/maintenance" className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Maintenance
        </Link>

        <header className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="flex items-center gap-5">
            <img src={vehicle.image} alt="" className="hairline w-32 h-24 object-cover" />
            <div>
              <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">{vehicle.plate} · {vehicle.mileage.toLocaleString()} km</p>
              <h1 className="font-display text-3xl md:text-4xl uppercase tracking-display mt-1">{vehicle.brand} {vehicle.name}</h1>
            </div>
          </div>
          <div className="hairline bg-surface-1 px-5 py-3">
            <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Current state</p>
            <p className="font-display text-xl uppercase tracking-display mt-1">{stateLabel[state]}</p>
          </div>
        </header>

        {/* State machine bar */}
        <div className="mt-8 hairline bg-surface-1 p-5">
          <div className="flex items-center justify-between overflow-x-auto gap-3">
            {stateOrder.map((s, i) => {
              const reached = stateOrder.indexOf(state as ChecklistState) >= i || state === "REJECTED" || state === "IN_REPAIR";
              const isCurrent = state === s;
              return (
                <div key={s} className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center gap-2 ${isCurrent ? "text-foreground" : reached ? "text-silver" : "text-silver/40"}`}>
                    <span className={`h-6 w-6 hairline flex items-center justify-center font-display text-[10px] ${isCurrent ? "bg-foreground text-background" : ""}`}>
                      {i + 1}
                    </span>
                    <span className="font-display text-[10px] uppercase tracking-wider-2">{stateLabel[s]}</span>
                  </div>
                  {i < stateOrder.length - 1 && <span className="h-px w-6 bg-[color:var(--hairline)]" />}
                </div>
              );
            })}
          </div>
          {(state === "REJECTED" || state === "IN_REPAIR") && (
            <p className="mt-4 hairline bg-danger/5 text-danger font-display text-xs uppercase tracking-wider-2 px-3 py-2 inline-flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Diverted — repair workflow active
            </p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Checklist */}
          <div className="space-y-8">
            {Object.entries(groups).map(([group, list]) => (
              <section key={group} className="hairline bg-surface-1">
                <h3 className="font-display uppercase tracking-display p-5 hairline-b">{group}</h3>
                <ul className="divide-y divide-[color:var(--hairline)]">
                  {list.map((item) => {
                    const v = items[item.id];
                    return (
                      <li key={item.id} className="flex items-center justify-between p-4 gap-4">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setItem(item.id, "ok")}
                            disabled={state !== "IN_PROGRESS"}
                            className={`h-9 w-9 hairline flex items-center justify-center transition-colors ${
                              v === "ok" ? "bg-success/20 text-success border-success/40" : "text-silver hover-surface"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                            aria-label="Pass"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setItem(item.id, "fail")}
                            disabled={state !== "IN_PROGRESS"}
                            className={`h-9 w-9 hairline flex items-center justify-center transition-colors ${
                              v === "fail" ? "bg-danger/20 text-danger border-danger/40" : "text-silver hover-surface"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                            aria-label="Fail"
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
              <label className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Inspector notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={state === "RELEASED"}
                placeholder="Anything outside the standard checklist…"
                rows={4}
                className="mt-2 w-full bg-background hairline p-3 text-sm focus:outline-none focus:border-foreground"
              />
            </section>
          </div>

          {/* Action panel */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="hairline bg-surface-1 p-5">
              <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Progress</p>
              <p className="font-display text-3xl mt-1">
                {okCount + failCount}<span className="text-silver text-base">/{checklistItems.length}</span>
              </p>
              <div className="mt-2 flex gap-3 text-xs font-display uppercase tracking-wider-2">
                <span className="text-success">{okCount} pass</span>
                <span className="text-danger">{failCount} fail</span>
              </div>

              <div className="mt-6 hairline-t pt-5 space-y-2">
                <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Next actions</p>
                {canTransitionTo.length === 0 && (
                  <p className="text-xs text-silver">Workflow complete. Vehicle released to fleet.</p>
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
                      → {stateLabel[next]}
                    </button>
                  );
                })}
                {state === "IN_PROGRESS" && !allChecked && (
                  <p className="text-[10px] text-silver mt-2">Check every item to submit for review.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
