import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/pocketpilot/pages";
import { pageHead } from "@/features/pocketpilot/metadata";
export const Route = createFileRoute("/settings")({
  head: () =>
    pageHead(
      "Budget Settings",
      "Configure your budget cycle and category spending caps in PocketPilot.",
    ),
  component: SettingsPage,
});
