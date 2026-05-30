/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { reservations as seedReservations } from "../data/reservations";
import { vehicles as seedVehicles } from "../data/vehicles";
import { createReservationId } from "../lib/reservation";
import type {
  Reservation,
  ReservationStatus,
  VehicleCategory,
  VehicleDetail,
  VehicleStatus,
} from "../types/fleet";

const STORAGE_KEY = "skyline-drive-hub:data:v1";

interface FleetDataState {
  vehicles: VehicleDetail[];
  reservations: Reservation[];
}

type NewReservation = Omit<Reservation, "id" | "status"> & {
  status?: ReservationStatus;
};

interface NewVehicleInput {
  brand: string;
  name: string;
  category: VehicleCategory;
  pricePerDay: number;
  plate: string;
  year: number;
  mileage: number;
  status: VehicleStatus;
  image?: string;
}

interface FleetDataContextValue extends FleetDataState {
  addReservation: (reservation: NewReservation) => Reservation;
  addVehicle: (vehicle: NewVehicleInput) => VehicleDetail;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  resetDemoData: () => void;
}

const initialState: FleetDataState = {
  vehicles: seedVehicles,
  reservations: seedReservations,
};

const FleetDataContext = createContext<FleetDataContextValue | undefined>(undefined);

export function FleetDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FleetDataState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredState();
    if (stored) {
      setState(mergeWithSeedData(stored));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<FleetDataContextValue>(
    () => ({
      ...state,
      addReservation(input) {
        let created = seedReservations[0];

        setState((current) => {
          created = {
            ...input,
            id: createReservationId(current.reservations),
            status: input.status ?? "CONFIRMED",
          };

          return {
            ...current,
            reservations: [created, ...current.reservations],
          };
        });

        return created;
      },
      addVehicle(input) {
        let created = seedVehicles[0];

        setState((current) => {
          const fallbackImage = input.image?.trim() || seedVehicles[0].image;
          created = {
            id: createVehicleId(input.brand, input.name, current.vehicles),
            brand: input.brand.trim(),
            name: input.name.trim(),
            category: input.category,
            image: fallbackImage,
            pricePerDay: input.pricePerDay,
            transmission: "Auto",
            seats: input.category === "Supercar" ? 2 : input.category === "Sport" ? 4 : 5,
            horsepower:
              input.category === "Electric" ? 670 : input.category === "Supercar" ? 710 : 395,
            status: input.status,
            year: input.year,
            plate: input.plate.trim().toUpperCase(),
            mileage: input.mileage,
            fuelType: input.category === "Electric" ? "Electric" : "Gasoline",
            topSpeed: input.category === "Supercar" ? 340 : 290,
            acceleration: input.category === "Supercar" ? 2.9 : 4.2,
            description:
              "Newly added fleet vehicle. Complete the operational profile before making it part of the premium booking rotation.",
            gallery: [
              fallbackImage,
              seedVehicles[0].image,
              seedVehicles[1].image,
              seedVehicles[2].image,
            ],
            features: ["Premium detailing", "Concierge pickup", "Full coverage eligible"],
          };

          return {
            ...current,
            vehicles: [created, ...current.vehicles],
          };
        });

        return created;
      },
      updateVehicleStatus(vehicleId, status) {
        setState((current) => ({
          ...current,
          vehicles: current.vehicles.map((vehicle) =>
            vehicle.id === vehicleId ? { ...vehicle, status } : vehicle,
          ),
        }));
      },
      resetDemoData() {
        setState(initialState);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [state],
  );

  return <FleetDataContext.Provider value={value}>{children}</FleetDataContext.Provider>;
}

export function useFleetData() {
  const context = useContext(FleetDataContext);

  if (!context) {
    throw new Error("useFleetData must be used inside FleetDataProvider");
  }

  return context;
}

function readStoredState(): FleetDataState | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as FleetDataState;
    if (!Array.isArray(parsed.vehicles) || !Array.isArray(parsed.reservations)) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}

function mergeWithSeedData(stored: FleetDataState): FleetDataState {
  const vehicleMap = new Map(seedVehicles.map((vehicle) => [vehicle.id, vehicle]));

  for (const storedVehicle of stored.vehicles) {
    const seedVehicle = vehicleMap.get(storedVehicle.id);
    vehicleMap.set(storedVehicle.id, {
      ...seedVehicle,
      ...storedVehicle,
      image: seedVehicle?.image ?? storedVehicle.image,
      gallery: seedVehicle?.gallery ?? storedVehicle.gallery,
    });
  }

  const reservationMap = new Map(
    seedReservations.map((reservation) => [reservation.id, reservation]),
  );

  for (const reservation of stored.reservations) {
    reservationMap.set(reservation.id, reservation);
  }

  return {
    vehicles: [...vehicleMap.values()],
    reservations: [...reservationMap.values()],
  };
}

function createVehicleId(brand: string, name: string, existing: VehicleDetail[]) {
  const base =
    `${brand}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "vehicle";
  let candidate = base;
  let suffix = 2;

  while (existing.some((vehicle) => vehicle.id === candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
