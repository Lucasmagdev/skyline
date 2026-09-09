export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export type VehicleCategory = "Sport" | "SUV" | "Electric" | "Supercar" | "Sedan";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  image: string;
  pricePerDay: number;
  transmission: string;
  seats: number;
  horsepower: number;
  status: VehicleStatus;
}

export interface VehicleDetail extends Vehicle {
  year: number;
  plate: string;
  mileage: number;
  fuelType: string;
  topSpeed: number;
  acceleration: number;
  description: string;
  gallery: string[];
  features: string[];
}

export type ReservationStatus = "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Reservation {
  id: string;
  vehicleId: string;
  customer: string;
  email: string;
  pickup: string;
  pickupDate: string;
  returnDate: string;
  total: number;
  status: ReservationStatus;
}
