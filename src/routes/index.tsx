import { createFileRoute } from '@tanstack/react-router';
import { OverviewPage } from '@/features/pocketpilot/pages';
import { pageHead } from '@/features/pocketpilot/metadata';
export const Route = createFileRoute('/')({
  head: () => pageHead('Your money at a glance', 'Your money. Your call. Track your budget, daily spending allowance, upcoming commitments, and savings with PocketPilot.'),
  component: OverviewPage,
});
