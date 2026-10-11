# Money Buddy Sim

Build this app using the HTML files referenced below. You can hotlink the images referenced in the HTML. The attached images are screenshots of the desired screens. Here are public links to the html of the screens which you should read and use to build the app:

1. https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDhiODgyODM1MjUwOTEwNGY0ZTgxMzJlZDc4EgsSBxCfprzY_B8YAZIBIwoKcHJvamVjdF9pZBIVQhM5MjU1ODgzODIwMzUzMDU1NTMw&filename=&opi=89354086

POCKETPILOT — STITCH DESIGN TO FULLY FUNCTIONAL REACT WEBSITE

You are a senior frontend engineer and UI/UX implementation specialist. Your task is to transform my existing Google Stitch UI/UX design for PocketPilot into a complete, functional, responsive website using a modern React-based framework.

This is an implementation task, not a design-generation task. The UI/UX design already exists in Stitch. Your responsibility is to reproduce that design accurately and make every intended interaction work.

Do not stop at a plan, wireframe, screenshot, prototype, or code snippet. Build the actual application in the current project workspace.

1. FIRST, ACCESS AND STUDY MY STITCH DESIGN

Before writing code:

Locate and inspect the existing project files and development environment.

Access the Stitch-generated design, including all available screens, components, assets, and design references.

Inspect the layout, typography, colors, spacing, backgrounds, cards, navigation, charts, buttons, forms, icons, and responsive behavior shown in the design.

Determine how the screens connect and identify the interactions implied by the UI.

Reuse the original assets and components wherever possible.

If Stitch provides exportable code, use it as a reference or starting point and integrate it into the React application.

If the design is provided through a URL that you cannot access directly, do not pretend you have inspected it. Use any available connected integration or request the exported code or screenshots needed to reproduce it accurately.

Primary rule: the existing Stitch design is the source of truth for the visual appearance.

Do not invent a new visual direction, replace the layout with a generic dashboard template, or redesign the interface without a clear technical reason.

2. USE A MODERN FRONTEND FRAMEWORK

Build the application using:

React

TypeScript

Vite for the development server and production build

Tailwind CSS for styling

shadcn/ui for reusable UI primitives where appropriate

Lucide React for icons

React Router if separate navigable pages are required

Recharts if the design includes charts

LocalStorage for persistent client-side application data

Use the existing framework if the workspace already contains a working equivalent React setup. Do not unnecessarily recreate the project.

The final application must be a genuine React application with reusable components, state management, working event handlers, and real calculations.

Do not use raw HTML/CSS as the entire implementation. JSX/TSX components and a proper modern framework must form the actual application.

Do not create a separate disconnected demo or leave the generated Stitch design as a static page.

3. REPRODUCE THE STITCH DESIGN ACCURATELY

Implement the supplied design as closely as possible.

Preserve the original:

Page structure and content hierarchy.

Component positions and alignment.

Typography and font weights.

Color palette and contrast.

Card sizes, borders, corner radii, and shadows.

Spacing, padding, and margins.

Navigation layout and active states.

Buttons, inputs, dropdowns, dialogs, and tooltips.

Chart styles and data presentation.

Icon style and placement.

Illustrations, images, and other supplied assets.

Desktop and mobile layouts, if both are available.

Use a consistent design-token system for colors, spacing, typography, radii, and shadows.

Avoid arbitrary CSS values when they conflict with the supplied design. Use exact design values where available and visually faithful approximations only when exact values cannot be obtained.

Do not substitute supplied assets with unrelated stock images, emoji, or generic icons.

If the Stitch design includes multiple screens, implement all of them and connect them through working navigation.

If any design element is ambiguous, make the smallest reasonable implementation decision that preserves the design instead of inventing an entirely new component.

4. PRODUCT: POCKETPILOT

PocketPilot is a personal budgeting and spending-awareness application.

Tagline: Your money. Your call.

The default example budget is ₹10,000 over 30 days.

The application should help users understand their available budget, daily spending limit, expense categories, spending patterns, and the consequences of hypothetical purchases.

Use Indian rupee formatting throughout the application.

Implement the product features according to the existing Stitch design. The design determines how features look; the requirements below determine how the relevant functionality behaves.

5. IMPLEMENT THE ACTUAL FUNCTIONALITY

A. Dashboard

Connect all displayed values to real application state.

Where these elements appear in the Stitch design, implement:

Total budget.

Total expenses.

Remaining balance.

Budget utilization.

Safe to Spend.

Days remaining.

Spending breakdown.

Recent transactions.

Budget status.

Quick actions.

Every total, percentage, chart, and summary must update when the underlying data changes.

Do not hardcode dashboard values independently from transaction records.

B. Transaction management

Implement the complete expense workflow:

Add an expense.

Edit an expense.

Delete an expense.

Select a category and date.

Enter a transaction name and amount.

Search and filter transactions if shown in the design.

Display the transaction history.

Update dashboard totals and charts immediately.

Persist changes after refreshing the page.

Use stable unique IDs for transaction records.

Validate required fields and reject invalid or non-positive expense amounts.

Editing an existing expense must update that record rather than creating a duplicate.

Deleting an expense must correctly recalculate every dependent value.

C. Budget calculations

Create a shared calculation layer instead of scattering formulas across UI components.

Use this baseline formula:

Safe to Spend = max(0, (Total Budget − Recorded Expenses − Applicable Unpaid Commitments − Reserved Savings) / Remaining Days)

Handle zero remaining days without dividing by zero.

Do not double-count expenses, paid commitments already recorded as expenses, or savings reservations.

Keep actual financial totals separate from hypothetical projections.

D. Vibe Check

If this feature appears in the supplied design, implement the spending simulator.

Allow users to enter a hypothetical purchase and see how it could affect their available balance and Safe to Spend.

Cancelling must leave actual data unchanged.

Applying the purchase must create exactly one real expense.

Prevent duplicate submissions.

Update the dashboard and transaction history after confirmation.

Clearly distinguish hypothetical calculations from actual financial data.

E. Pattern Radar

If present in the design, implement spending insights based on real transaction data.

Examples include the highest-spending category, frequent small purchases, spending pace, and unusually large expenses.

Do not invent historical transactions or unsupported insights.

Dismissing an insight must not modify financial totals.

F. Ripple Effect

If present in the design, implement interactive spending projections.

Users may explore scenarios such as spending more per day, reducing category spending, or making a hypothetical purchase.

Show the projected effect using the interface designed in Stitch.

Exploring a scenario must not change actual transaction records or financial totals.

G. Budget, commitments, and savings goals

Implement these features if they appear in the design:

Budget configuration.

Budget duration and dates.

Upcoming commitments.

Paid/unpaid status.

Savings goals and progress.

Explicitly reserved savings.

All changes must update dependent calculations consistently.

Do not introduce prominent new sections that are absent from the design unless required to complete a clearly implied workflow.

6. DATA AND STATE MANAGEMENT

Use a clear and maintainable React architecture.

Suggested structure:

src/
components/
pages/
layouts/
hooks/
lib/
utils/
types/
assets/

Adapt this structure to the existing project where appropriate.

Requirements:

Use TypeScript types for transactions, budgets, commitments, goals, and insights.

Keep shared financial calculations in reusable utility functions.

Use React state or a suitable lightweight state-management approach.

Persist user data with LocalStorage.

Load saved data safely when the application starts.

Handle missing or malformed stored data without crashing.

Keep derived totals consistent with the source records.

Keep hypothetical scenario state separate from actual financial state.

Provide a reset or restore-demo-data option if appropriate.

Do not add a backend, authentication service, database, or external API unless the existing project requires it. The basic application must work locally without paid services.

7. MAKE EVERY INTERACTIVE ELEMENT WORK

Inspect the Stitch design for all interactive elements, including:

Navigation items.

Buttons and quick actions.

Tabs.

Dropdowns.

Search fields.

Filters.

Forms.

Modals and dialogs.

Tooltips.

Charts with interactive elements.

Expandable sections.

Dismiss controls.

Date selectors.

Confirmation dialogs.

For each element, implement its intended behavior.

Do not leave buttons that do nothing, forms that only look functional, links pointing to #, or navigation items that lead nowhere.

If a feature is not yet implemented, do not falsely present it as operational. Implement it or clearly report the limitation.

8. RESPONSIVE IMPLEMENTATION

Reproduce the supplied design across desktop, tablet, and mobile screens.

Test at these viewport widths:

1440px.

1280px.

768px.

390px.

375px.

Requirements:

No unintended horizontal scrolling.

No overlapping or clipped content.

Charts resize correctly.

Forms remain usable on small screens.

Navigation adapts appropriately.

Buttons and interactive targets remain touch-friendly.

Modals fit within the viewport.

Text remains readable.

Preserve the original visual hierarchy at each breakpoint.

If Stitch includes mobile-specific screens, use them as the reference rather than simply shrinking the desktop layout.

9. USE ANTIGRAVITY AND LOVABLE EFFECTIVELY

Use Antigravity to inspect, edit, run, debug, and test the actual codebase.

Use the Lovable plugin where it helps generate or refine React components, layouts, or interactions.

When using generated code:

Check that it follows the selected framework and project structure.

Integrate it into the existing application.

Reuse the same design tokens and components.

Resolve dependency conflicts and duplicate implementations.

Connect the UI to the shared application state.

Verify that the generated component works inside the running application.

Do not generate multiple disconnected versions of the website.

Do not blindly overwrite the existing project with a new template.

10. TEST THE ACTUAL WEBSITE

After implementation, start the development server and inspect the running website using the available browser tools.

Test these flows:

The website opens without major runtime errors.

All designed screens are accessible through navigation.

Adding a ₹100 expense decreases the remaining budget by ₹100.

Editing that expense to ₹150 updates the total to ₹150 rather than ₹250.

Deleting the expense restores the original balance.

Refreshing the browser preserves saved data.

Invalid form submissions are rejected.

Spending charts and category totals reflect actual records.

Cancelling a hypothetical purchase leaves actual data unchanged.

Confirming a hypothetical purchase creates exactly one expense.

Projections do not modify actual totals.

All visible buttons and controls work.

The responsive layouts work at the specified viewport widths.

The production build completes successfully.

Inspect the browser console and fix errors discovered during testing.

Run the production build using the package manager and scripts appropriate for the existing project.

Do not mark a test as passed unless you actually ran it.

11. DEPLOYMENT READINESS

Prepare the project for deployment.

Verify the development command.

Verify the production build command.

Resolve missing dependencies.

Ensure assets load correctly.

Check that routes work after refreshing if client-side routing is used.

Keep environment-specific secrets out of the source code.

Keep the project compatible with a standard Vite deployment on Vercel or an equivalent static hosting platform.

Do not claim the application has been deployed unless deployment was actually completed and the resulting URL was verified.

12. EXECUTION RULES

Follow these rules throughout the task:

Inspect the existing project and Stitch design first.

Then implement the website directly.

Preserve the supplied design rather than replacing it with a generic template.

Prioritize a working React application over decorative mockups.

Use small, verifiable changes.

Preserve working functionality while refining the UI.

Fix errors instead of repeatedly regenerating the whole project.

Do not stop after writing a plan.

Do not ask unnecessary questions when the design and project already provide the required information.

If a critical resource is inaccessible, state exactly what is missing and continue with the available material.

Never claim that a feature, test, GitHub push, or deployment succeeded without verification.

13. FINAL DELIVERABLE

The final deliverable must be the actual working PocketPilot website in the current project workspace.

After completing the work, report:

The framework and technologies used.

The Stitch screens implemented.

The functional features completed.

The responsive layouts tested.

The tests that passed and failed.

Whether the production build succeeded.

Any remaining limitations.

Whether GitHub is configured.

The verified live deployment URL, if deployment was completed.

Start now. Inspect the Stitch design and current workspace, then build the actual React website. Do not return only instructions, mockups, or sample code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://money-buddy-sim.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fce19363-21e6-568c-9b3c-6a44734fa167).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
