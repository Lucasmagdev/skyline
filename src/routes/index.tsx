import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VehicleCard } from "@/components/VehicleCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFleetData } from "@/contexts/FleetDataContext";
import { useLocale } from "@/contexts/LocaleContext";
import {
  findVehicleReservationConflict,
  getDefaultBookingWindow,
  isReservableStatus,
  PICKUP_LOCATIONS,
  rentalDays,
} from "@/lib/reservation";
import type { VehicleCategory } from "@/types/fleet";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, reservations } = useFleetData();
  const { t } = useLocale();

  useEffect(() => {
    if (user?.role === "concierge") navigate({ to: "/admin" });
    else if (user?.role === "inspector") navigate({ to: "/maintenance" });
  }, [user, navigate]);
  const [category, setCategory] = useState<"All" | VehicleCategory>("All");
  const [booking, setBooking] = useState<{
    pickup: string;
    pickupDate: string;
    returnDate: string;
  }>(() => ({
    pickup: PICKUP_LOCATIONS[0],
    ...getDefaultBookingWindow(),
  }));
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const visible = vehicles.filter(
    (vehicle) =>
      vehicle.status !== "MAINTENANCE" && (category === "All" || vehicle.category === category),
  );
  const availableMatches = visible.filter(
    (vehicle) =>
      isReservableStatus(vehicle.status) &&
      !findVehicleReservationConflict(
        reservations,
        vehicle.id,
        booking.pickupDate,
        booking.returnDate,
      ),
  );

  function checkAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const days = rentalDays(booking.pickupDate, booking.returnDate);

    setAvailabilityMessage(
      t("home.booking.availability", {
        count: availableMatches.length,
        plural: availableMatches.length === 1 ? "" : "s",
        days,
        dayPlural: days === 1 ? "" : "s",
        pickup: booking.pickup,
      }),
    );

    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroCar}
            alt={t("home.heroAlt")}
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
                {t("home.eyebrow")}
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-display leading-[0.9] text-foreground">
              {t("home.hero.line1")}
              <br />
              <span className="text-silver">{t("home.hero.line2")}</span> {t("home.hero.line3")}
            </h1>

            <p className="mt-8 max-w-md text-base text-silver leading-relaxed">
              {t("home.hero.copy")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#fleet"
                className="group inline-flex items-center gap-3 bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background"
              >
                {t("home.hero.explore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#booking"
                className="group inline-flex items-center gap-3 hairline px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-foreground hover-surface"
              >
                {t("home.hero.reserveNow")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Booking strip */}
        <div
          id="booking"
          className="relative -mt-20 md:-mt-24 mx-auto max-w-[1280px] px-6 lg:px-10"
        >
          <div className="hairline bg-surface-1/95 backdrop-blur-xl">
            <form
              onSubmit={checkAvailability}
              className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[color:var(--hairline)]"
            >
              <BookingSelect
                icon={<MapPin className="h-4 w-4" />}
                label={t("home.booking.pickup")}
                value={booking.pickup}
                onChange={(pickup) => setBooking((current) => ({ ...current, pickup }))}
                options={[...PICKUP_LOCATIONS]}
              />
              <BookingInput
                icon={<Calendar className="h-4 w-4" />}
                label={t("home.booking.from")}
                value={booking.pickupDate}
                onChange={(pickupDate) => setBooking((current) => ({ ...current, pickupDate }))}
              />
              <BookingInput
                icon={<Calendar className="h-4 w-4" />}
                label={t("home.booking.until")}
                value={booking.returnDate}
                onChange={(returnDate) => setBooking((current) => ({ ...current, returnDate }))}
              />
              <div className="flex items-center justify-center p-4">
                <button
                  type="submit"
                  className="w-full bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90 transition-opacity"
                >
                  {t("home.booking.check")}
                </button>
              </div>
            </form>
          </div>
          {availabilityMessage && (
            <p className="mt-3 font-display text-[11px] uppercase tracking-wider-2 text-silver">
              {availabilityMessage}
            </p>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="hairline-b mt-32">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--hairline)]">
          {[
            { v: "120+", l: t("home.stats.vehicles") },
            { v: "24/7", l: t("home.stats.concierge") },
            { v: "8", l: t("home.stats.locations") },
            { v: "100%", l: t("home.stats.insurance") },
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
              {t("home.fleet.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl uppercase tracking-display text-foreground">
              {t("home.fleet.title1")}
              <br />
              <span className="text-silver">{t("home.fleet.title2")}</span>
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", "Sport", "SUV", "Electric", "Supercar"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`hairline px-4 py-2 font-display text-[11px] uppercase tracking-wider-2 hover-surface ${
                  category === c ? "bg-foreground text-background border-foreground" : "text-silver"
                }`}
              >
                {t(`common.category.${c.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 mt-32">
        <div className="hairline bg-surface-1 p-10 md:p-16 relative overflow-hidden bg-grid">
          <div className="relative max-w-2xl">
            <h3 className="font-display text-4xl md:text-5xl uppercase tracking-display text-foreground">
              {t("home.cta.title1")}
              <br />
              <span className="text-silver">{t("home.cta.title2")}</span>
            </h3>
            <p className="mt-4 text-silver max-w-md">{t("home.cta.copy")}</p>
            <a
              href="mailto:concierge@skyline.example?subject=Skyline%20Club%20membership"
              className="mt-8 inline-flex items-center gap-3 bg-foreground px-6 py-4 font-display text-xs uppercase tracking-wider-2 text-background"
            >
              {t("home.cta.apply")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function BookingSelect({
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
    <label className="flex items-center gap-4 p-5 text-left hover-surface">
      <span className="text-silver">{icon}</span>
      <span className="flex flex-col">
        <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
          {label}
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-0.5 bg-transparent font-display text-sm uppercase tracking-display text-foreground outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-background text-foreground">
              {option}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function BookingInput({
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
    <label className="flex items-center gap-4 p-5 text-left hover-surface">
      <span className="text-silver">{icon}</span>
      <span className="flex flex-col">
        <span className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
          {label}
        </span>
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-0.5 bg-transparent font-display text-sm uppercase tracking-display text-foreground outline-none [color-scheme:dark]"
        />
      </span>
    </label>
  );
}
