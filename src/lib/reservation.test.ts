import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateRentalQuote,
  createReservationId,
  findVehicleReservationConflict,
  isReservableStatus,
  isValidEmail,
  reservationOverlapsWindow,
  rentalDays,
} from "./reservation.ts";
import type { Reservation } from "../types/fleet.ts";

test("calculates a complete rental quote from booking inputs", () => {
  const quote = calculateRentalQuote({
    pricePerDay: 389,
    pickupDate: "2026-05-29",
    returnDate: "2026-06-02",
    insurance: true,
    delivery: true,
  });

  assert.equal(quote.days, 4);
  assert.equal(quote.subtotal, 1556);
  assert.equal(quote.insuranceFee, 196);
  assert.equal(quote.deliveryFee, 120);
  assert.equal(quote.taxes, 159);
  assert.equal(quote.total, 2031);
});

test("keeps rental duration valid when dates are invalid or reversed", () => {
  assert.equal(rentalDays("2026-06-02", "2026-05-29"), 1);
  assert.equal(rentalDays("invalid", "2026-05-29"), 1);
});

test("creates sequential reservation IDs without colliding with seeded data", () => {
  assert.equal(
    createReservationId([
      {
        id: "RV-1041",
        vehicleId: "m4",
        customer: "A",
        email: "a@example.com",
        pickup: "Los Angeles, CA",
        pickupDate: "2026-05-29",
        returnDate: "2026-06-02",
        total: 100,
        status: "CONFIRMED",
      },
    ]),
    "RV-1042",
  );
});

test("validates contact and reservable vehicle states", () => {
  assert.equal(isValidEmail("client@example.com"), true);
  assert.equal(isValidEmail("client@"), false);
  assert.equal(isReservableStatus("AVAILABLE"), true);
  assert.equal(isReservableStatus("RENTED"), false);
});

test("detects blocking reservation overlaps by vehicle and date window", () => {
  const reservations: Reservation[] = [
    {
      id: "RV-2001",
      vehicleId: "m4",
      customer: "Client",
      email: "client@example.com",
      pickup: "Los Angeles, CA",
      pickupDate: "2026-06-10",
      returnDate: "2026-06-14",
      total: 1000,
      status: "CONFIRMED",
    },
    {
      id: "RV-2002",
      vehicleId: "m4",
      customer: "Past",
      email: "past@example.com",
      pickup: "Los Angeles, CA",
      pickupDate: "2026-06-01",
      returnDate: "2026-06-03",
      total: 1000,
      status: "COMPLETED",
    },
  ];

  assert.equal(reservationOverlapsWindow(reservations[0], "2026-06-12", "2026-06-16"), true);
  assert.equal(reservationOverlapsWindow(reservations[0], "2026-06-14", "2026-06-18"), false);
  assert.equal(
    findVehicleReservationConflict(reservations, "m4", "2026-06-12", "2026-06-16")?.id,
    "RV-2001",
  );
  assert.equal(
    findVehicleReservationConflict(reservations, "m4", "2026-06-01", "2026-06-03"),
    undefined,
  );
});
