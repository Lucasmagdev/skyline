import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import type { VehicleDetail } from "@/types/fleet";

export const vehicles: VehicleDetail[] = [
  {
    id: "m4",
    name: "M4 Competition",
    brand: "BMW",
    category: "Sport",
    image: car1,
    pricePerDay: 389,
    transmission: "Auto",
    seats: 4,
    horsepower: 503,
    status: "AVAILABLE",
    year: 2024,
    plate: "SKY-4M01",
    mileage: 8420,
    fuelType: "Gasoline",
    topSpeed: 290,
    acceleration: 3.5,
    description:
      "The M4 Competition is a precision-engineered grand tourer. Twin-turbo inline-six, carbon-fiber roof, and a soundtrack tuned in Munich.",
    gallery: [car1, car2, car3, car4],
    features: [
      "Carbon ceramic brakes",
      "Adaptive M suspension",
      "Harman Kardon audio",
      "Heads-up display",
    ],
  },
  {
    id: "rrs",
    name: "Range Rover Sport",
    brand: "Land Rover",
    category: "SUV",
    image: car2,
    pricePerDay: 459,
    transmission: "Auto",
    seats: 5,
    horsepower: 395,
    status: "AVAILABLE",
    year: 2024,
    plate: "SKY-RR07",
    mileage: 12110,
    fuelType: "Hybrid",
    topSpeed: 242,
    acceleration: 5.7,
    description:
      "Luxury that goes anywhere. Air suspension, panoramic roof, and Meridian audio — engineered for the city and the unknown.",
    gallery: [car2, car1, car4, car3],
    features: ["Air suspension", "Terrain Response 2", "Meridian audio", "Massage seats"],
  },
  {
    id: "f8",
    name: "F8 Tributo",
    brand: "Ferrari",
    category: "Supercar",
    image: car3,
    pricePerDay: 1290,
    transmission: "DCT",
    seats: 2,
    horsepower: 710,
    status: "RENTED",
    year: 2023,
    plate: "SKY-F810",
    mileage: 4200,
    fuelType: "Gasoline",
    topSpeed: 340,
    acceleration: 2.9,
    description:
      "An icon. The F8 Tributo distills decades of Maranello's V8 heritage into a single, devastating machine.",
    gallery: [car3, car1, car2, car4],
    features: [
      "Side Slip Control 6.1",
      "Ferrari Dynamic Enhancer",
      "Carbon fiber package",
      "Racing seats",
    ],
  },
  {
    id: "ms",
    name: "Model S Plaid",
    brand: "Tesla",
    category: "Electric",
    image: car4,
    pricePerDay: 349,
    transmission: "Single",
    seats: 5,
    horsepower: 1020,
    status: "AVAILABLE",
    year: 2024,
    plate: "SKY-MS22",
    mileage: 15880,
    fuelType: "Electric",
    topSpeed: 322,
    acceleration: 2.1,
    description:
      "Three motors, 1020 horsepower, and silence. The Plaid is the fastest accelerating production car ever made.",
    gallery: [car4, car2, car1, car3],
    features: ["Tri-motor AWD", "Autopilot included", '17" cinematic display', "Yoke steering"],
  },
];

export function getVehicleById(id: string) {
  return vehicles.find((v) => v.id === id);
}
