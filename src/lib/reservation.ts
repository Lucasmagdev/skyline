import type { Reservation, VehicleStatus } from "../types/fleet";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const PICKUP_LOCATIONS = [
  "Los Angeles, CA",
  "Miami, FL",
  "New York, NY",
  "Sao Paulo, BR",
] as const;

export interface QuoteInput {
  pricePerDay: number;
  pickupDate: string;
  returnDate: string;
  insurance: boolean;
  delivery: boolean;
}

export interface RentalQuote {
  days: number;
  subtotal: number;
  insuranceFee: number;
  deliveryFee: number;
  taxes: number;
  total: number;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDaysISO(base: Date, days: number): string {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return toISODate(next);
}

export function getDefaultBookingWindow(base = new Date()) {
  return {
    pickupDate: addDaysISO(base, 1),
    returnDate: addDaysISO(base, 5),
  };
}

export function rentalDays(pickupDate: string, returnDate: string): number {
  const pickup = parseISODate(pickupDate);
  const returns = parseISODate(returnDate);

  if (!pickup || !returns) return 1;

  return Math.max(1, Math.ceil((returns - pickup) / MS_PER_DAY));
}

export function calculateRentalQuote(input: QuoteInput): RentalQuote {
  const days = rentalDays(input.pickupDate, input.returnDate);
  const subtotal = input.pricePerDay * days;
  const insuranceFee = input.insurance ? 49 * days : 0;
  const deliveryFee = input.delivery ? 120 : 0;
  const taxes = Math.round((subtotal + insuranceFee + deliveryFee) * 0.085);

  return {
    days,
    subtotal,
    insuranceFee,
    deliveryFee,
    taxes,
    total: subtotal + insuranceFee + deliveryFee + taxes,
  };
}

export function isReservableStatus(status: VehicleStatus): boolean {
  return status === "AVAILABLE";
}

export function isBlockingReservation(reservation: Reservation): boolean {
  return reservation.status === "CONFIRMED" || reservation.status === "ACTIVE";
}

export function reservationOverlapsWindow(
  reservation: Reservation,
  pickupDate: string,
  returnDate: string,
): boolean {
  const pickup = parseISODate(pickupDate);
  const returns = parseISODate(returnDate);
  const reservationPickup = parseISODate(reservation.pickupDate);
  const reservationReturn = parseISODate(reservation.returnDate);

  if (!pickup || !returns || !reservationPickup || !reservationReturn) return false;

  return pickup < reservationReturn && returns > reservationPickup;
}

export function findVehicleReservationConflict(
  reservations: Reservation[],
  vehicleId: string,
  pickupDate: string,
  returnDate: string,
): Reservation | undefined {
  return reservations.find(
    (reservation) =>
      reservation.vehicleId === vehicleId &&
      isBlockingReservation(reservation) &&
      reservationOverlapsWindow(reservation, pickupDate, returnDate),
  );
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function createReservationId(existing: Reservation[]): string {
  const nextNumber =
    existing.reduce((max, reservation) => {
      const match = reservation.id.match(/^RV-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 1000) + 1;

  return `RV-${nextNumber}`;
}

function parseISODate(value: string): number | undefined {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return Date.UTC(year, month - 1, day);
}
