import { createFileRoute } from "@tanstack/react-router";
import { GoalsPage } from "@/features/pocketpilot/pages";
import { pageHead } from "@/features/pocketpilot/metadata";
export const Route = createFileRoute("/goals-commitments")({
  head: () =>
    pageHead(
      "Goals & Commitments",
      "Protect your savings and recurring commitments with PocketPilot.",
    ),
  component: GoalsPage,
});
