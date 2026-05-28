import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";
import heroCar from "@/assets/hero-car.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyline Car Rental — Premium Fleet, Surgical Service" },
      {
        name: "description",
        content:
          "Drive sport, SUV, electric and supercars from Skyline. A curated luxury fleet with transparent pricing and on-demand reservations.",
      },
      { property: "og:title", content: "Skyline Car Rental" },
      {
        property: "og:description",
        content: "Premium automotive experiences. Curated fleet, surgical service.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const visible = vehicles.filter((v) => v.status !== "MAINTENANCE");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroCar}
            alt="Black luxury sports car under a single overhead light"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 pt-24 pb-40 md:pt-32 md:pb-56">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-silver" />
              <span className="font-display text-[11px] uppercase tracking-wider-2 text-silver">
                Est. 2024 — Premium Fleet
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-display leading-[0.9] text-foreground">
              Drive
              <br />
              <span className="text-silver">with</span> conviction.
            </h1>

            <p className="mt-8 max-w-md text-base text-silver leading-relaxed">
              A curated fleet of sport, SUV, electric and supercars — delivered
              with the discipline of a pit crew and the comfort of a private club.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#fleet"
                className="group inline-flex items-center gap-3 bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background"
              >
                Explore the fleet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#booking"
                className="group inline-flex items-center gap-3 hairline px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-foreground hover-surface"
              >
                Reserve now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Booking strip */}
        <div id="booking" className="relative -mt-20 md:-mt-24 mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="hairline bg-surface-1/95 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[color:var(--hairline)]">
              <BookingField icon={<MapPin className="h-4 w-4" />} label="Pickup" value="Los Angeles, CA" />
              <BookingField icon={<Calendar className="h-4 w-4" />} label="From" value="Oct 14, 2026" />
              <BookingField icon={<Calendar className="h-4 w-4" />} label="Until" value="Oct 19, 2026" />
              <div className="flex items-center justify-center p-4">
                <button className="w-full bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90 transition-opacity">
                  Check availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="hairline-b mt-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--hairline)]">
          {[
            { v: "120+", l: "Vehicles in fleet" },
            { v: "24/7", l: "Concierge service" },
            { v: "8", l: "Pickup locations" },
            { v: "100%", l: "Insurance covered" },
          ].map((s, i) => (
            <div key={i} className={`p-8 ${i === 0 ? "border-l-0 pl-0 md:pl-8" : ""}`}>
              <p className="font-display text-4xl md:text-5xl text-foreground">{s.v}</p>
              <p className="mt-2 font-display text-[11px] uppercase tracking-wider-2 text-silver">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FLEET */}
      <section id="fleet" className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-display text-[11px] uppercase tracking-wider-2 text-silver">
              — The Fleet
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl uppercase tracking-display text-foreground">
              Engineered to perform.
              <br />
              <span className="text-silver">Curated to impress.</span>
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Sport", "SUV", "Electric", "Supercar"].map((c, i) => (
              <button
                key={c}
                className={`hairline px-4 py-2 font-display text-[11px] uppercase tracking-wider-2 hover-surface ${
                  i === 0 ? "bg-foreground text-background border-foreground" : "text-silver"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-32">
        <div className="hairline bg-surface-1 p-10 md:p-16 relative overflow-hidden bg-grid">
          <div className="relative max-w-2xl">
            <h3 className="font-display text-4xl md:text-5xl uppercase tracking-display text-foreground">
              Member access.
              <br />
              <span className="text-silver">Priority delivery.</span>
            </h3>
            <p className="mt-4 text-silver max-w-md">
              Join Skyline Club for door-to-door delivery, exclusive vehicle drops
              and a dedicated concierge.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-3 bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background"
            >
              Apply for membership
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function BookingField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <button className="flex items-center gap-4 p-5 text-left hover-surface">
      <span className="text-silver">{icon}</span>
      <span className="flex flex-col">
        <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
          {label}
        </span>
        <span className="font-display text-sm uppercase tracking-display text-foreground mt-0.5">
          {value}
        </span>
      </span>
    </button>
  );
}
