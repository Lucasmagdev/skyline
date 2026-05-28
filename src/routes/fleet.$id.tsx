import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Calendar, Check, Gauge, MapPin, Shield, Users, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getVehicleById, vehicles } from "@/data/vehicles";

export const Route = createFileRoute("/fleet/$id")({
  loader: ({ params }) => {
    const vehicle = getVehicleById(params.id);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.vehicle.brand} ${loaderData.vehicle.name} — Skyline`
          : "Skyline",
      },
      {
        name: "description",
        content: loaderData?.vehicle.description ?? "Reserve a premium vehicle from the Skyline fleet.",
      },
    ],
  }),
  component: VehicleDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <p className="font-display uppercase tracking-wider-2 text-silver text-xs">404</p>
        <h1 className="font-display text-3xl uppercase tracking-display mt-2">Vehicle not found</h1>
        <Link to="/" className="mt-6 inline-block hairline px-5 py-3 font-display text-xs uppercase tracking-wider-2 hover-surface">
          Back to fleet
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <p className="text-silver">Something went wrong.</p>
    </div>
  ),
});

function VehicleDetailPage() {
  const { vehicle } = Route.useLoaderData();
  const [activeImage, setActiveImage] = useState(vehicle.gallery[0]);
  const [days, setDays] = useState(3);
  const [insurance, setInsurance] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const subtotal = vehicle.pricePerDay * days;
  const insuranceFee = insurance ? 49 * days : 0;
  const deliveryFee = delivery ? 120 : 0;
  const taxes = useMemo(() => Math.round((subtotal + insuranceFee + deliveryFee) * 0.085), [subtotal, insuranceFee, deliveryFee]);
  const total = subtotal + insuranceFee + deliveryFee + taxes;

  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-10">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-wider-2 text-silver hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to fleet
        </Link>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* Gallery */}
        <div>
          <div className="hairline aspect-[16/10] overflow-hidden bg-surface-1">
            <img src={activeImage} alt={`${vehicle.brand} ${vehicle.name}`} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {vehicle.gallery.map((g: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(g)}
                className={`hairline aspect-[4/3] overflow-hidden hover-surface ${g === activeImage ? "ring-1 ring-foreground" : ""}`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-10">
            <span className="font-display text-[11px] uppercase tracking-wider-2 text-silver">{vehicle.brand}</span>
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-display mt-2">{vehicle.name}</h1>
            <p className="mt-6 max-w-xl text-silver leading-relaxed">{vehicle.description}</p>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 hairline divide-x divide-[color:var(--hairline)]">
              <SpecBox icon={<Gauge className="h-4 w-4" />} value={`${vehicle.horsepower}`} label="Horsepower" />
              <SpecBox icon={<Zap className="h-4 w-4" />} value={`${vehicle.acceleration}s`} label="0–100 km/h" />
              <SpecBox icon={<Users className="h-4 w-4" />} value={`${vehicle.seats}`} label="Seats" />
              <SpecBox icon={<Shield className="h-4 w-4" />} value={`${vehicle.topSpeed}`} label="Top speed km/h" />
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xs uppercase tracking-wider-2 text-silver">Features</h3>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-3 hairline px-4 py-3">
                    <Check className="h-4 w-4 text-foreground" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking column */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="hairline bg-surface-1 p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-3xl">
                ${vehicle.pricePerDay}
                <span className="text-sm text-silver ml-1">/day</span>
              </p>
              <span className={`font-display text-[10px] uppercase tracking-wider-2 px-2 py-1 hairline ${isAvailable ? "text-success" : "text-warning"}`}>
                {vehicle.status}
              </span>
            </div>

            <div className="hairline-t mt-6 pt-6 space-y-4">
              <Row icon={<MapPin className="h-4 w-4" />} label="Pickup" value="Los Angeles, CA" />
              <Row icon={<Calendar className="h-4 w-4" />} label="Dates" value="Oct 14 – Oct 19, 2026" />
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Rental days</label>
                <div className="mt-2 flex items-center hairline">
                  <button onClick={() => setDays(Math.max(1, days - 1))} className="px-4 py-3 hover-surface">−</button>
                  <span className="flex-1 text-center font-display text-lg">{days}</span>
                  <button onClick={() => setDays(days + 1)} className="px-4 py-3 hover-surface">+</button>
                </div>
              </div>
              <Toggle label="Full insurance coverage" sub="$49 / day" checked={insurance} onChange={setInsurance} />
              <Toggle label="Door-to-door delivery" sub="$120 flat" checked={delivery} onChange={setDelivery} />
            </div>

            <div className="hairline-t mt-6 pt-6 space-y-2 font-display text-sm">
              <LineItem label={`Vehicle × ${days} days`} value={subtotal} />
              {insurance && <LineItem label="Insurance" value={insuranceFee} />}
              {delivery && <LineItem label="Delivery" value={deliveryFee} />}
              <LineItem label="Taxes & fees" value={taxes} muted />
              <div className="hairline-t mt-3 pt-3 flex items-center justify-between">
                <span className="uppercase tracking-wider-2 text-xs text-silver">Total</span>
                <span className="text-2xl">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={!isAvailable || confirmed}
              onClick={() => setConfirmed(true)}
              className="mt-6 w-full bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {confirmed ? "Reservation confirmed ✓" : isAvailable ? "Confirm reservation" : "Currently unavailable"}
            </button>
            {confirmed && (
              <p className="mt-3 text-xs text-silver text-center">
                A confirmation has been sent. Your concierge will be in touch.
              </p>
            )}
          </div>

          <p className="mt-4 text-xs text-silver/70 leading-relaxed">
            Free cancellation up to 24h before pickup. Driver must be 25+ with a valid license. Security deposit held on the card.
          </p>
        </aside>
      </section>

      {/* Related fleet */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-32">
        <h2 className="font-display text-3xl uppercase tracking-display">More from the fleet</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {vehicles.filter((v) => v.id !== vehicle.id).slice(0, 4).map((v) => (
            <Link
              key={v.id}
              to="/fleet/$id"
              params={{ id: v.id }}
              className="group hairline hover-surface bg-card overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={v.image} alt={v.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">{v.brand}</p>
                <p className="font-display uppercase tracking-display">{v.name}</p>
                <p className="text-sm text-silver mt-1">${v.pricePerDay}/day</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function SpecBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="p-5">
      <span className="text-silver">{icon}</span>
      <p className="font-display text-2xl mt-3">{value}</p>
      <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver mt-1">{label}</p>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-silver">{icon}</span>
      <div>
        <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">{label}</p>
        <p className="font-display text-sm uppercase tracking-display">{value}</p>
      </div>
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between hairline px-4 py-3 hover-surface text-left"
    >
      <span>
        <span className="block font-display text-sm uppercase tracking-display">{label}</span>
        <span className="block text-xs text-silver">{sub}</span>
      </span>
      <span className={`h-5 w-9 hairline relative transition-colors ${checked ? "bg-foreground" : ""}`}>
        <span className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${checked ? "right-0.5 bg-background" : "left-0.5 bg-foreground"}`} />
      </span>
    </button>
  );
}

function LineItem({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-silver" : ""}`}>
      <span className="text-sm">{label}</span>
      <span>${value.toLocaleString()}</span>
    </div>
  );
}
