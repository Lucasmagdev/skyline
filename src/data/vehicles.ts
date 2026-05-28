import { Vehicle } from "@/components/VehicleCard";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";

export const vehicles: Vehicle[] = [
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
  },
];
