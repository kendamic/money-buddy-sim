import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePilot } from "./context";
import { rupees, type Transaction } from "./finance";
import { ExpenseDialog } from "./controls";
const logo =
  "https://lh3.googleusercontent.com/aida/AEtjO1VZjUkf9HYvrx-ejGD-ii8Pd5KM2wibm_D9Gq8K8UqDcpyNyghaP_nQmwpL13UsxA0_ZmlSgGTGcEuj0pwuu1y8pzZzeqvDwekt-JcJkoyx9sHET8d-5e1oXfIcfRHLCNHqTf8MK8XpIV3izzNwbsmxPQpl-dmdP1VDAO8tXtrpataYKt-EzUpJQaCBzAyz7GeTqQ0_THEKf-P-HNky4M_RecWJJtfBr-ZUpsSjSVuypP99OMLch-ZZ0LI";
const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuQHBV_Q7Ay7JKbNvZ6ht2i1CGEUSKrkYGOhI6ClVIztQToocR-oxVMTy2Jq7_5IiwcN411ruxGhXFuZfukrIUFZxwl0uED8-vKoJnCu8GGwKOywG6IBjteghrY63MtbKiJmaWo2VOa3c4PEgshJ4GEzzhpjUiVd4uuqwcpJrkAJki1n1RdWjRJauE9vaK-aORyL8-TChUImF2dODaF7KYXjMmTp9xrEFB8fuN77VAr96tjDDH6_Mo";
export const navigation = [
  { to: "/", label: "Overview" },
  { to: "/expenses", label: "Expenses" },
  { to: "/vibe-check", label: "Vibe Check" },
  { to: "/pattern-radar", label: "Pattern Radar" },
  { to: "/goals-commitments", label: "Goals & Commitments" },
  { to: "/settings", label: "Settings" },
] as const;
const Actions = createContext<((t?: Transaction) => void) | null>(null);
export function useExpenseAction() {
  const a = useContext(Actions);
  if (!a) throw new Error("Expense actions unavailable");
  return a;
}
function Brand() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2">
      <img src={logo} alt="" className="h-8 w-8 shrink-0 object-contain" />
      <span className="truncate font-heading text-[22px] font-semibold">PocketPilot</span>
    </Link>
  );
}
export function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}
export function PilotShell({ children }: { children: ReactNode }) {
  const { state, metrics: m, storageError, ready } = usePilot();
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState<{ expense?: Transaction | undefined } | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const cycle = `Day ${m.day} of ${state.budget.duration} • ${dateLabel(state.budget.startDate)} - ${dateLabel(m.endDate)}`;
  const nav = (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 px-4 py-2">
      {navigation.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          activeOptions={{ exact: true }}
          className="nav-link"
          onClick={() => setMenu(false)}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <Actions.Provider value={(expense) => setForm({ expense })}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between bg-card lg:flex">
        <div>
          <div className="flex h-16 items-center px-4">
            <Brand />
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 rounded-xl bg-surface-low p-2">
              <img src={avatar} alt="Alex Vance" className="size-8 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold">Alex Vance</p>
                <p className="text-xs text-muted-foreground">Pro Pilot</p>
              </div>
            </div>
          </div>
          {nav}
        </div>
        <div className="p-4">
          <div className="soft-block flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Cycle Status</span>
              <span className="text-xs font-semibold text-primary">
                {Math.round((m.day / state.budget.duration) * 100)}% passed
              </span>
            </div>
            <progress className="progress" value={m.day} max={state.budget.duration} />
            <span className="text-[11px] text-muted-foreground">{cycle}</span>
          </div>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="fixed inset-x-0 top-0 z-30 h-16 bg-card/95 backdrop-blur-xl lg:left-60">
          <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 lg:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                className="lg:hidden"
                size="icon"
                variant="ghost"
                aria-label={menu ? "Close navigation" : "Open navigation"}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X /> : <Menu />}
              </Button>
              <div className="min-w-0 lg:hidden">
                <Brand />
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-surface-low px-4 py-1.5 text-xs text-muted-foreground lg:flex">
                <CalendarDays className="size-4 text-secondary" />
                {cycle}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 text-on-primary-container md:flex">
                <span className="eyebrow text-on-primary-container">Safe to Spend</span>
                <span className="text-sm font-semibold">{rupees(m.remaining)} left</span>
              </div>
              <Button disabled={!ready} aria-label="Add Expense" onClick={() => setForm({})}>
                <Plus />
                <span className="hidden sm:inline">Add Expense</span>
              </Button>
            </div>
          </div>
        </header>
        {menu && (
          <div className="fixed inset-x-0 top-16 z-30 border-b bg-card py-3 shadow-lg lg:hidden">
            {nav}
          </div>
        )}
        <main className="min-h-screen pt-16">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-10">
            {storageError && (
              <p role="alert" className="rounded-lg bg-tertiary-container p-3 text-tertiary">
                {storageError}
              </p>
            )}
            {children}
            <footer className="flex justify-between gap-4 pb-2 pt-2 text-xs text-muted-foreground">
              <span>PocketPilot · Your money. Your call.</span>
              <span>{path === "/" ? "Your October ledger" : "Your personal ledger"}</span>
            </footer>
          </div>
        </main>
      </div>
      {form && <ExpenseDialog open expense={form.expense} onClose={() => setForm(null)} />}
    </Actions.Provider>
  );
}
