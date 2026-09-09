import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Wrench } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useFleetData } from "@/contexts/FleetDataContext";
import { useLocale } from "@/contexts/LocaleContext";
import type { VehicleCategory, VehicleStatus } from "@/types/fleet";
import { StatusPill } from "./admin.index";

export const Route = createFileRoute("/admin/fleet")({
  component: AdminFleet,
});

function AdminFleet() {
  const { vehicles, addVehicle, resetDemoData } = useFleetData();
  const { formatCurrency, formatNumber, t } = useLocale();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    name: "",
    category: "Sport" as VehicleCategory,
    pricePerDay: 390,
    plate: "",
    year: 2026,
    mileage: 0,
    status: "AVAILABLE" as VehicleStatus,
  });
  const [formError, setFormError] = useState("");

  function submitVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.brand.trim() || !form.name.trim() || !form.plate.trim()) {
      setFormError(t("admin.formRequired"));
      return;
    }

    addVehicle(form);
    setDialogOpen(false);
    setFormError("");
    setForm({
      brand: "",
      name: "",
      category: "Sport",
      pricePerDay: 390,
      plate: "",
      year: 2026,
      mileage: 0,
      status: "AVAILABLE",
    });
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1280px]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
            {t("admin.inventory")}
          </p>
          <h1 className="font-display text-4xl uppercase tracking-display mt-2">
            {t("admin.fleetManagement")}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> {t("admin.addVehicle")}
          </button>
          <button
            onClick={resetDemoData}
            className="hairline px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-silver hover-surface"
          >
            {t("admin.resetDemo")}
          </button>
        </div>
      </header>

      <div className="mt-10 hairline bg-surface-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hairline-b">
            <tr className="text-left font-display text-[10px] uppercase tracking-wider-2 text-silver">
              <th className="p-4">{t("admin.vehicle")}</th>
              <th className="p-4">{t("admin.plate")}</th>
              <th className="p-4">{t("admin.category")}</th>
              <th className="p-4">{t("admin.mileage")}</th>
              <th className="p-4">{t("admin.priceDay")}</th>
              <th className="p-4">{t("admin.status")}</th>
              <th className="p-4 text-right">{t("admin.actions")}</th>
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
                      <p className="text-xs text-silver">
                        {v.brand} · {v.year}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs text-silver">{v.plate}</td>
                <td className="p-4 text-silver">
                  {t(`common.category.${v.category.toLowerCase()}`)}
                </td>
                <td className="p-4 text-silver">{formatNumber(v.mileage)} km</td>
                <td className="p-4 font-display">{formatCurrency(v.pricePerDay)}</td>
                <td className="p-4">
                  <StatusPill status={v.status} />
                </td>
                <td className="p-4 text-right">
                  <Link
                    to="/maintenance/$vehicleId"
                    params={{ vehicleId: v.id }}
                    className="inline-flex items-center gap-1.5 hairline px-3 py-1.5 font-display text-[10px] uppercase tracking-wider-2 hover-surface"
                  >
                    <Wrench className="h-3 w-3" /> {t("admin.checklist")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
          <form onSubmit={submitVehicle} className="hairline w-full max-w-2xl bg-surface-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                  {t("admin.fleetIntake")}
                </p>
                <h2 className="mt-1 font-display text-3xl uppercase tracking-display">
                  {t("admin.addVehicle")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground"
              >
                {t("common.close")}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <VehicleInput
                label={t("admin.brand")}
                value={form.brand}
                onChange={(brand) => setForm((current) => ({ ...current, brand }))}
              />
              <VehicleInput
                label={t("admin.model")}
                value={form.name}
                onChange={(name) => setForm((current) => ({ ...current, name }))}
              />
              <VehicleSelect
                label={t("admin.category")}
                value={form.category}
                options={["Sport", "SUV", "Electric", "Supercar", "Sedan"].map((category) => ({
                  value: category,
                  label: t(`common.category.${category.toLowerCase()}`),
                }))}
                onChange={(category) =>
                  setForm((current) => ({ ...current, category: category as VehicleCategory }))
                }
              />
              <VehicleSelect
                label={t("admin.status")}
                value={form.status}
                options={["AVAILABLE", "RENTED", "MAINTENANCE"].map((status) => ({
                  value: status,
                  label: t(`common.status.${status.toLowerCase()}`),
                }))}
                onChange={(status) =>
                  setForm((current) => ({ ...current, status: status as VehicleStatus }))
                }
              />
              <VehicleInput
                label={t("admin.plate")}
                value={form.plate}
                onChange={(plate) => setForm((current) => ({ ...current, plate }))}
              />
              <VehicleInput
                label={t("admin.priceDay")}
                type="number"
                value={String(form.pricePerDay)}
                onChange={(pricePerDay) =>
                  setForm((current) => ({ ...current, pricePerDay: Number(pricePerDay) || 0 }))
                }
              />
              <VehicleInput
                label={t("admin.year")}
                type="number"
                value={String(form.year)}
                onChange={(year) =>
                  setForm((current) => ({ ...current, year: Number(year) || current.year }))
                }
              />
              <VehicleInput
                label={t("admin.mileage")}
                type="number"
                value={String(form.mileage)}
                onChange={(mileage) =>
                  setForm((current) => ({ ...current, mileage: Number(mileage) || 0 }))
                }
              />
            </div>

            {formError && <p className="mt-4 text-xs text-danger">{formError}</p>}

            <button
              type="submit"
              className="mt-6 w-full bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90"
            >
              {t("admin.saveVehicle")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function VehicleInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label>
      <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-background hairline px-3 py-2 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}

function VehicleSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-background hairline px-3 py-2 text-sm outline-none focus:border-foreground"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-background text-foreground">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
