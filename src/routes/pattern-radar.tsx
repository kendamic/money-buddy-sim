import { createFileRoute } from "@tanstack/react-router";
import { RadarPage } from "@/features/pocketpilot/pages";
import { pageHead } from "@/features/pocketpilot/metadata";
export const Route = createFileRoute("/pattern-radar")({
  head: () =>
    pageHead(
      "Pattern Radar",
      "Discover non-judgmental spending insights derived from your actual PocketPilot ledger.",
    ),
  component: RadarPage,
});
