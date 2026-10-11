import { createFileRoute } from '@tanstack/react-router';
import { VibePage } from '@/features/pocketpilot/pages';
import { pageHead } from '@/features/pocketpilot/metadata';
export const Route = createFileRoute('/vibe-check')({
  head: () => pageHead('Vibe Check', 'Simulate a purchase before swiping. See its impact on your balance and safe daily allowance.'),
  component: VibePage,
});
