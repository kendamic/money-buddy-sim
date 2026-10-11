import { createFileRoute } from "@tanstack/react-router";
import { RipplePage } from "@/features/pocketpilot/pages";
import { pageHead } from "@/features/pocketpilot/metadata";
export const Route = createFileRoute("/ripple-effect")({
  head: () =>
    pageHead(
      "Ripple Effect",
      "Explore how changes in daily and category spending affect your projected budget.",
    ),
  component: RipplePage,
});
