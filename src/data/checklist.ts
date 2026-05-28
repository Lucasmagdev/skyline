// Maintenance checklist — strict state machine for post-return inspection.
// State transitions:
//  PENDING -> IN_PROGRESS (inspector starts)
//  IN_PROGRESS -> AWAITING_REVIEW (all items checked)
//  AWAITING_REVIEW -> APPROVED | REJECTED
//  APPROVED -> RELEASED (back to fleet, vehicle becomes AVAILABLE)
//  REJECTED -> IN_REPAIR
//  IN_REPAIR -> IN_PROGRESS (re-inspect after repair)

export type ChecklistState =
  | "PENDING"
  | "IN_PROGRESS"
  | "AWAITING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IN_REPAIR"
  | "RELEASED";

export const stateOrder: ChecklistState[] = [
  "PENDING",
  "IN_PROGRESS",
  "AWAITING_REVIEW",
  "APPROVED",
  "RELEASED",
];

export const stateTransitions: Record<ChecklistState, ChecklistState[]> = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["AWAITING_REVIEW"],
  AWAITING_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["RELEASED"],
  REJECTED: ["IN_REPAIR"],
  IN_REPAIR: ["IN_PROGRESS"],
  RELEASED: [],
};

export const stateLabel: Record<ChecklistState, string> = {
  PENDING: "Pending intake",
  IN_PROGRESS: "Inspection in progress",
  AWAITING_REVIEW: "Awaiting supervisor",
  APPROVED: "Approved",
  REJECTED: "Rejected — needs repair",
  IN_REPAIR: "In repair",
  RELEASED: "Released to fleet",
};

export interface ChecklistItem {
  id: string;
  label: string;
  group: "Exterior" | "Interior" | "Mechanical" | "Documents";
}

export const checklistItems: ChecklistItem[] = [
  { id: "ext-body", label: "Body — no new dents or scratches", group: "Exterior" },
  { id: "ext-wheels", label: "Wheels & tires — no curb damage, pressure OK", group: "Exterior" },
  { id: "ext-lights", label: "All lights functional", group: "Exterior" },
  { id: "ext-glass", label: "Windshield & windows — no chips", group: "Exterior" },
  { id: "int-seats", label: "Seats clean, no stains or tears", group: "Interior" },
  { id: "int-electronics", label: "Infotainment, AC, audio working", group: "Interior" },
  { id: "int-smell", label: "No smoke, food or pet odor", group: "Interior" },
  { id: "mech-fluids", label: "Oil, coolant, brake fluid levels", group: "Mechanical" },
  { id: "mech-brakes", label: "Brakes responsive, no warning lights", group: "Mechanical" },
  { id: "mech-fuel", label: "Fuel / charge returned ≥ contract level", group: "Mechanical" },
  { id: "doc-keys", label: "Both keys returned", group: "Documents" },
  { id: "doc-papers", label: "Insurance & registration in glovebox", group: "Documents" },
];
