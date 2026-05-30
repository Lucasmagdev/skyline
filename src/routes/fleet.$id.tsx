import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Calendar, Check, Gauge, MapPin, Shield, Users, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useFleetData } from "@/contexts/FleetDataContext";
import { useLocale } from "@/contexts/LocaleContext";
import {
  addDaysISO,
  calculateRentalQuote,
  findVehicleReservationConflict,
  getDefaultBookingWindow,
  isReservableStatus,
  isValidEmail,
  PICKUP_LOCATIONS,
} from "@/lib/reservation";

export const Route = createFileRoute("/fleet/$id")({
  head: () => ({
    meta: [
      { title: "Reserve a premium vehicle - Skyline" },
      {
        name: "description",
        content: "Configure and reserve a premium vehicle from the Skyline fleet.",
      },
    ],
  }),
  component: VehicleDetailPage,
  notFoundComponent: VehicleNotFound,
  errorComponent: VehicleError,
});

function VehicleDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, reservations, addReservation } = useFleetData();
  const { formatCurrency, formatNumber, t } = useLocale();

  useEffect(() => {
    if (user?.role === "concierge") navigate({ to: "/admin" });
    else if (user?.role === "inspector") navigate({ to: "/maintenance" });
  }, [user, navigate]);
  const vehicle = vehicles.find((item) => item.id === id);
  const [activeImage, setActiveImage] = useState<string>();
  const [booking, setBooking] = useState<{
    pickup: string;
    pickupDate: string;
    returnDate: string;
  }>(() => ({
    pickup: PICKUP_LOCATIONS[0],
    ...getDefaultBookingWindow(),
  }));
  const [insurance, setInsurance] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmationId, setConfirmationId] = useState("");

  useEffect(() => {
    setActiveImage(undefined);
    setConfirmationId("");
    setFormError("");
  }, [id]);

  const quote = useMemo(
    () =>
      calculateRentalQuote({
        pricePerDay: vehicle?.pricePerDay ?? 0,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        insurance,
        delivery,
      }),
    [booking.pickupDate, booking.returnDate, delivery, insurance, vehicle?.pricePerDay],
  );

  if (!vehicle) {
    return <VehicleNotFound />;
  }

  const reservationConflict = findVehicleReservationConflict(
    reservations,
    vehicle.id,
    booking.pickupDate,
    booking.returnDate,
  );
  const isAvailable = isReservableStatus(vehicle.status) && !reservationConflict;
  const selectedImage = activeImage ?? vehicle.gallery[0];

  function setRentalDays(days: number) {
    const safeDays = Math.max(1, days);
    setBooking((current) => ({
      ...current,
      returnDate: addDaysISO(dateFromISO(current.pickupDate), safeDays),
    }));
  }

  function confirmReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!vehicle) return;
    if (reservationConflict) {
      setFormError(t("vehicle.conflict", { id: reservationConflict.id }));
      return;
    }
    if (!isAvailable) return;
    if (customer.trim().length < 2) {
      setFormError(t("vehicle.nameError"));
      return;
    }
    if (!isValidEmail(email)) {
      setFormError(t("vehicle.emailError"));
      return;
    }

    const reservation = addReservation({
      vehicleId: vehicle.id,
      customer: customer.trim(),
      email: email.trim(),
      pickup: booking.pickup,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      total: quote.total,
    });

    setConfirmationId(reservation.id);
    setFormError("");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-wider-2 text-silver hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("common.backToFleet")}
        </Link>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Gallery */}
        <div>
          <div className="hairline aspect-[16/10] overflow-hidden bg-surface-1">
            <img
              src={selectedImage}
              alt={`${vehicle.brand} ${vehicle.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {vehicle.gallery.map((g: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(g)}
                className={`hairline aspect-[4/3] overflow-hidden hover-surface ${g === selectedImage ? "ring-1 ring-foreground" : ""}`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-10">
            <span className="font-display text-[11px] uppercase tracking-wider-2 text-silver">
              {vehicle.brand}
            </span>
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-display mt-2">
              {vehicle.name}
            </h1>
            <p className="mt-6 max-w-xl text-silver leading-relaxed">
              {translateOrFallback(t, `vehicle.description.${vehicle.id}`, vehicle.description)}
            </p>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 hairline divide-x divide-[color:var(--hairline)]">
              <SpecBox
                icon={<Gauge className="h-4 w-4" />}
                value={formatNumber(vehicle.horsepower)}
                label={t("vehicle.horsepower")}
              />
              <SpecBox
                icon={<Zap className="h-4 w-4" />}
                value={`${vehicle.acceleration}s`}
                label={t("vehicle.acceleration")}
              />
              <SpecBox
                icon={<Users className="h-4 w-4" />}
                value={formatNumber(vehicle.seats)}
                label={t("vehicle.seats")}
              />
              <SpecBox
                icon={<Shield className="h-4 w-4" />}
                value={formatNumber(vehicle.topSpeed)}
                label={t("vehicle.topSpeed")}
              />
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xs uppercase tracking-wider-2 text-silver">
                {t("vehicle.features")}
              </h3>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-3 hairline px-4 py-3">
                    <Check className="h-4 w-4 text-foreground" />
                    <span className="text-sm">
                      {translateOrFallback(t, `vehicle.feature.${f}`, f)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking column */}
        <aside className="lg:sticky lg:top-24 self-start">
          <form onSubmit={confirmReservation} className="hairline bg-surface-1 p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl">
                {formatCurrency(vehicle.pricePerDay)}
                <span className="text-sm text-silver ml-1">{t("vehicle.perDay")}</span>
              </p>
              <span
                className={`font-display text-[10px] uppercase tracking-wider-2 px-2 py-1 hairline ${isAvailable ? "text-success" : "text-warning"}`}
              >
                {t(
                  `common.status.${reservationConflict ? "reserved" : vehicle.status.toLowerCase()}`,
                )}
              </span>
            </div>

            <div className="hairline-t mt-6 pt-6 space-y-4">
              <SelectRow
                icon={<MapPin className="h-4 w-4" />}
                label={t("home.booking.pickup")}
                value={booking.pickup}
                options={[...PICKUP_LOCATIONS]}
                onChange={(pickup) => setBooking((current) => ({ ...current, pickup }))}
              />
              <DateRow
                icon={<Calendar className="h-4 w-4" />}
                label={t("vehicle.pickupDate")}
                value={booking.pickupDate}
                onChange={(pickupDate) =>
                  setBooking((current) => ({
                    ...current,
                    pickupDate,
                    returnDate: addDaysISO(dateFromISO(pickupDate), quote.days),
                  }))
                }
              />
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                  {t("vehicle.rentalDays")}
                </label>
                <div className="mt-2 flex items-center hairline">
                  <button
                    type="button"
                    onClick={() => setRentalDays(quote.days - 1)}
                    className="px-4 py-3 hover-surface"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-display text-lg">{quote.days}</span>
                  <button
                    type="button"
                    onClick={() => setRentalDays(quote.days + 1)}
                    className="px-4 py-3 hover-surface"
                  >
                    +
                  </button>
                </div>
              </div>
              <Toggle
                label={t("vehicle.fullInsurance")}
                sub={t("vehicle.insuranceSub")}
                checked={insurance}
                onChange={setInsurance}
              />
              <Toggle
                label={t("vehicle.delivery")}
                sub={t("vehicle.deliverySub")}
                checked={delivery}
                onChange={setDelivery}
              />
              <div className="grid grid-cols-1 gap-3">
                <TextField
                  label={t("vehicle.customerName")}
                  value={customer}
                  onChange={setCustomer}
                />
                <TextField
                  label={t("vehicle.email")}
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
              </div>
            </div>

            <div className="hairline-t mt-6 pt-6 space-y-2 font-display text-sm">
              <LineItem
                label={t("vehicle.vehicleDays", { days: quote.days })}
                value={quote.subtotal}
              />
              {insurance && <LineItem label={t("vehicle.insurance")} value={quote.insuranceFee} />}
              {delivery && <LineItem label={t("vehicle.deliveryFee")} value={quote.deliveryFee} />}
              <LineItem label={t("vehicle.taxes")} value={quote.taxes} muted />
              <div className="hairline-t mt-3 pt-3 flex items-center justify-between">
                <span className="uppercase tracking-wider-2 text-xs text-silver">
                  {t("vehicle.total")}
                </span>
                <span className="text-2xl">{formatCurrency(quote.total)}</span>
              </div>
            </div>

            {formError && <p className="mt-4 text-xs text-danger text-center">{formError}</p>}
            {reservationConflict && !formError && (
              <p className="mt-4 text-xs text-warning text-center">
                {t("vehicle.conflictHint", { id: reservationConflict.id })}
              </p>
            )}
            <button
              type="submit"
              disabled={!isAvailable || Boolean(confirmationId)}
              className="mt-6 w-full bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {confirmationId
                ? t("vehicle.confirmed", { id: confirmationId })
                : isAvailable
                  ? t("vehicle.confirm")
                  : t("vehicle.unavailable")}
            </button>
            {confirmationId && (
              <p className="mt-3 text-xs text-silver text-center">{t("vehicle.confirmedCopy")}</p>
            )}
          </form>

          <p className="mt-4 text-xs text-silver/70 leading-relaxed">{t("vehicle.policy")}</p>
        </aside>
      </section>

      {/* Related fleet */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-32">
        <h2 className="font-display text-3xl uppercase tracking-display">{t("vehicle.related")}</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {vehicles
            .filter((v) => v.id !== vehicle.id)
            .slice(0, 4)
            .map((v) => (
              <Link
                key={v.id}
                to="/fleet/$id"
                params={{ id: v.id }}
                className="group hairline hover-surface bg-card overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
                    {v.brand}
                  </p>
                  <p className="font-display uppercase tracking-display">{v.name}</p>
                  <p className="text-sm text-silver mt-1">
                    {formatCurrency(v.pricePerDay)}
                    {t("vehicle.perDay")}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function VehicleNotFound() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display uppercase tracking-wider-2 text-silver text-xs">404</p>
        <h1 className="font-display text-3xl uppercase tracking-display mt-2">
          {t("vehicle.notFound")}
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block hairline px-5 py-3 font-display text-xs uppercase tracking-wider-2 hover-surface"
        >
          {t("common.backToFleet")}
        </Link>
      </div>
    </main>
  );
}

function VehicleError() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <p className="text-silver">{t("common.error")}</p>
    </div>
  );
}

function SpecBox({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="p-5">
      <span className="text-silver">{icon}</span>
      <p className="font-display text-2xl mt-3">{value}</p>
      <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver mt-1">
        {label}
      </p>
    </div>
  );
}

function SelectRow({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-silver">{icon}</span>
      <div>
        <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">{label}</p>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-transparent font-display text-sm uppercase tracking-display outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-background text-foreground">
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function DateRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-silver">{icon}</span>
      <div>
        <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">{label}</p>
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-transparent font-display text-sm uppercase tracking-display outline-none [color-scheme:dark]"
        />
      </div>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
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

function Toggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between hairline px-4 py-3 hover-surface text-left"
    >
      <span>
        <span className="block font-display text-sm uppercase tracking-display">{label}</span>
        <span className="block text-xs text-silver">{sub}</span>
      </span>
      <span
        className={`h-5 w-9 hairline relative transition-colors ${checked ? "bg-foreground" : ""}`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${checked ? "right-0.5 bg-background" : "left-0.5 bg-foreground"}`}
        />
      </span>
    </button>
  );
}

function dateFromISO(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return new Date();

  return new Date(year, month - 1, day);
}

function LineItem({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  const { formatCurrency } = useLocale();

  return (
    <div className={`flex items-center justify-between ${muted ? "text-silver" : ""}`}>
      <span className="text-sm">{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}

function translateOrFallback(
  t: (key: string, values?: Record<string, string | number>) => string,
  key: string,
  fallback: string,
) {
  const translated = t(key);
  return translated === key ? fallback : translated;
}
