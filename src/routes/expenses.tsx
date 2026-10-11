import { createFileRoute } from '@tanstack/react-router';
import { ExpensesPage } from '@/features/pocketpilot/pages';
import { pageHead } from '@/features/pocketpilot/metadata';
export const Route = createFileRoute('/expenses')({
  head: () => pageHead('Expense Ledger', 'Manage and search your PocketPilot expenses. Every purchase updates your budget and spending breakdown.'),
  component: ExpensesPage,
});
