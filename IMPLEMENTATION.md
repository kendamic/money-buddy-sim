# PocketPilot delivery

## Application
- React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS v4, shadcn/Radix, Lucide, Recharts, and Zod.
- Preserved the existing workspace framework instead of installing a second router or disconnected app.
- The supplied HTML contains one complete overview dashboard, expense dialog, and pattern dialog. Its original logo/profile images, mint/lime palette, fonts, layout, and card structure are reused.
- Connected pages: overview, expenses, Vibe Check, Pattern Radar, Goals & Commitments, Settings, and Ripple Effect. No separate reference screens were supplied for these additional pages; they extend the supplied design language.

## Working features
- Expense add/edit/delete, category/date selection, amount validation, search, category/date filters, and refresh persistence.
- Shared calculations for expenses, remaining balance, budget utilization, unpaid commitments, reserved savings, daily allowance, categories, and forecasts.
- Paid commitments create a single linked expense; undo removes that expense and restores the reservation. Deleting a linked expense marks its commitment unpaid again.
- Goals and commitments can be added, edited, and deleted. Reserved savings reduce daily allowance exactly once.
- Purchase simulation, cancellation without financial changes, and guarded single confirmation.
- Real-record spending insights, dismiss/restore, and week-long overview snooze.
- Ripple projections remain separate from actual records.
- Budget dates/duration/category caps, JSON export, example reset with confirmation, and malformed-data recovery.

## Verification
- 9 automated tests passed: 8 financial-integrity tests and the existing routing test.
- Browser tests passed: adding ₹100, editing to ₹150 without duplication, deleting and restoring balance, refresh persistence, invalid amount rejection, all page URLs, simulation cancellation, one confirmed purchase, and projection isolation.
- Browser tests passed: commitment payment/undo, commitment CRUD, savings CRUD, budget balance updates, search/category filter, malformed storage recovery, and mobile navigation/dialog sizing.
- All seven pages checked for horizontal overflow at 1440, 1280, 768, 390, and 375px; none found. Desktop overview and mobile overview screenshots reviewed.
- Browser page-error collection was empty in both test suites.
- Latest automatic production validation reported `build OK`. The build was performed by the workspace harness, not manually rerun.
- An initial browser test used an incorrect category selector; correcting the test selector and rerunning passed. Initial optional-property TypeScript errors were fixed; later automatic builds passed.

## Commands and deployment
- Development: `bun run dev` (the workspace server is already running).
- Production: `bun run build` (Vite with existing TanStack Start hosting configuration).
- Tests: `bun run test`.
- No backend, authentication, database, or paid services added.
- No GitHub remote is configured in the inspected repository; existing remotes are Lovable-managed storage. No GitHub push performed.
- Not published or deployed; there is no verified public production URL. Current preview: https://id-preview--fce19363-21e6-568c-9b3c-6a44734fa167.lovable.app

## Notes and limitations
- The supplied HTML contains inconsistent sample daily figures and ignores its locked ₹2,000 savings in the calculation. PocketPilot correctly shows ₹250/day for ₹7,420 remaining minus ₹918 unpaid commitments minus ₹2,000 reserved savings over 18 days.
- The seven example transactions come directly from the supplied export, with dates aligned to a current rolling example cycle. Insights are calculated from those records, not the export's unsupported six-coffee claim.
- Data is saved only in this browser/device, with no cross-device synchronization. Browser storage restrictions are reported in-app.
- Original remotely hosted fonts and supplied images require network access.
- The preserved TanStack Start application is not a newly converted static-only Vite SPA. Deployment should use a host supporting the existing framework configuration.