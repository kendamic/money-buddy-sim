import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  PlusCircle,
  SlidersHorizontal,
  Radar,
  X,
  Plus,
  LockKeyhole,
  Pencil,
  Trash2,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  categories,
  insights,
  localDate,
  rupees,
  stateSchema,
  type Commitment,
  type Goal,
} from "./finance";
import { usePilot } from "./store";
import { useExpenseAction } from "./shell";
import {
  CategoryBurn,
  Commitments,
  ExpenseList,
  Forecast,
  RadarBanner,
  Stats,
  VibeCard,
} from "./widgets";
import { ConfirmDialog } from "./controls";
export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="eyebrow text-secondary">PocketPilot · Your money. Your call.</p>
      <h1 className="mt-2">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}
export function OverviewPage() {
  const { state, metrics: m } = usePilot();
  const add = useExpenseAction();
  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:items-start xl:flex-row xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-secondary">
              Cycle Day {m.day} of {state.budget.duration}
            </span>
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="eyebrow">
              {new Date(`${state.budget.startDate}T12:00:00`).toLocaleDateString("en-IN", {
                month: "long",
              })}{" "}
              Ledger active
            </span>
          </div>
          <h1 className="mt-1">Your money at a glance.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Intentional pacing calibrated for day {m.day}. Commitments quarantined, flexible
            reserves unlocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/vibe-check">
              <SlidersHorizontal />
              Simulate Purchase
            </Link>
          </Button>
          <Button onClick={() => add()}>
            <PlusCircle />
            Record Expense
          </Button>
        </div>
      </div>
      <Stats />
      <RadarBanner />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Forecast />
        </div>
        <div className="lg:col-span-5">
          <CategoryBurn />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Commitments />
        </div>
        <div className="lg:col-span-5">
          <ExpenseList />
        </div>
        <div className="lg:col-span-3">
          <VibeCard />
        </div>
      </div>
    </>
  );
}
export function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <>
      <PageHeading
        title="Every purchase, in perspective."
        subtitle="Your live ledger. The small moments and the big decisions, all accounted for."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="field-label">
          Search expenses
          <input
            type="search"
            className="field bg-card"
            placeholder="Search a merchant or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="field-label">
          Category
          <select
            className="field bg-card"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          From date
          <input
            className="field bg-card"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="field-label">
          To date
          <input
            className="field bg-card"
            type="date"
            min={from}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
      </div>
      <ExpenseList all search={search} category={category} from={from} to={to} />
    </>
  );
}
export function VibePage() {
  return (
    <>
      <PageHeading
        title="Pause. Check the vibe."
        subtitle="Your next purchase, without the guesswork. Nothing hits your ledger until you say so."
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <VibeCard expanded />
        <div className="flex flex-col gap-6">
          <CategoryBurn />
          <Button asChild variant="secondary" className="self-start">
            <Link to="/ripple-effect">
              Explore the Ripple Effect
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
export function RadarPage() {
  const { state, update } = usePilot();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const list = insights(state).filter((i) => !dismissed.includes(i.id));
  return (
    <>
      <PageHeading
        title="Notice the little patterns."
        subtitle="A clearer view of your spending rhythm. Awareness, not judgment."
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setDismissed([]);
            update((s) => ({ ...s, radarSnoozedUntil: undefined }));
          }}
        >
          Restore Insights
        </Button>
        <Button asChild variant="ghost">
          <Link to="/ripple-effect">
            Explore Ripple Effect
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((i) => (
          <article className="panel" key={i.id}>
            <div className="flex items-center justify-between">
              <Radar className="size-6 text-primary" />
              <Button
                variant="ghost"
                size="icon"
                title="Dismiss insight"
                aria-label={`Dismiss ${i.title}`}
                onClick={() => setDismissed((v) => [...v, i.id])}
              >
                <X />
              </Button>
            </div>
            <h3 className="mt-4">{i.title}</h3>
            <p className="mt-2 text-muted-foreground">{i.detail}</p>
          </article>
        ))}
      </div>
      {!list.length && (
        <p className="py-8 text-muted-foreground">
          No insights to show. Add expenses or restore dismissed insights.
        </p>
      )}
      <Forecast />
    </>
  );
}
export function RipplePage() {
  const { state, metrics: m } = usePilot();
  const [extra, setExtra] = useState(0);
  const [reduction, setReduction] = useState(0);
  const [category, setCategory] = useState<(typeof categories)[number]>("Food & Snacks");
  const categoryForecast = m.day > 0 ? (m.totals[category] / m.day) * m.remainingDays : 0;
  const saving = (categoryForecast * reduction) / 100;
  const projected = m.forecast + extra * m.remainingDays - saving;
  return (
    <>
      <PageHeading
        title="Small choices. Real ripples."
        subtitle="Explore how a change in your daily pace might shape the end of your cycle."
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <label className="field-label">
            Extra daily spending: {rupees(extra)}
            <input
              className="accent-primary"
              type="range"
              min="0"
              max="1000"
              step="10"
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
            />
          </label>
          <label className="field-label">
            Reduce category spending
            <select
              className="field bg-card"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Reduction: {reduction}%
            <input
              className="accent-primary"
              type="range"
              min="0"
              max="100"
              step="5"
              value={reduction}
              onChange={(e) => setReduction(Number(e.target.value))}
            />
          </label>
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => {
              setExtra(0);
              setReduction(0);
            }}
          >
            Reset Scenario
          </Button>
        </div>
        <div className="panel panel-soft">
          <p className="eyebrow">Hypothetical Outlook · Not Recorded</p>
          <p className="metric-value mt-3">{rupees(projected)}</p>
          <p className="text-muted-foreground">projected cycle-end spending</p>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <dt>Current forecast</dt>
              <dd>{rupees(m.forecast)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Extra daily spending</dt>
              <dd>+ {rupees(extra * m.remainingDays)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Category savings</dt>
              <dd>− {rupees(saving)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-primary">
              <dt>Projected budget left</dt>
              <dd>{rupees(state.budget.amount - projected)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Projection over {m.remainingDays} remaining days. Actual balance stays at{" "}
            {rupees(m.remaining)}.
          </p>
        </div>
      </div>
      <Forecast />
    </>
  );
}
export function GoalsPage() {
  const { state, update } = usePilot();
  const [editor, setEditor] = useState<{
    kind: "goal" | "commitment";
    item?: Goal | Commitment;
  } | null>(null);
  const [remove, setRemove] = useState<{ kind: "goal" | "commitment"; id: string } | null>(null);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor) return;
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "").trim();
    const amount = Number(d.get("amount"));
    const reserved = Number(d.get("reserved") ?? 0);
    if (
      !name ||
      amount <= 0 ||
      amount > 1e9 ||
      !Number.isFinite(amount) ||
      reserved < 0 ||
      reserved > amount ||
      !Number.isFinite(reserved)
    ) {
      setError("Enter a name and positive amount. Reserved savings cannot exceed the goal target.");
      return;
    }
    const id = editor.item?.id ?? crypto.randomUUID();
    const candidate =
      editor.kind === "goal"
        ? { id, name, target: amount, reserved }
        : {
            id,
            name,
            amount,
            dueDate: String(d.get("date")),
            expenseId:
              editor.item && "expenseId" in editor.item ? editor.item.expenseId : undefined,
          };
    const next =
      editor.kind === "goal"
        ? {
            ...state,
            goals: state.goals.some((g) => g.id === id)
              ? state.goals.map((g) => (g.id === id ? candidate : g))
              : [...state.goals, candidate],
          }
        : {
            ...state,
            commitments: state.commitments.some((c) => c.id === id)
              ? state.commitments.map((c) => (c.id === id ? candidate : c))
              : [...state.commitments, candidate],
          };
    const parsed = stateSchema.safeParse(next);
    if (!parsed.success) {
      setError("Check your amounts and date, then try again.");
      return;
    }
    update(() => parsed.data);
    setEditor(null);
    setError("");
  }
  return (
    <>
      <PageHeading
        title="Protect what matters."
        subtitle="Make space for future you. Commitments and reserved savings stay outside your daily allowance."
      />
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setError("");
            setEditor({ kind: "goal" });
          }}
        >
          <Plus />
          Add Savings Goal
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setError("");
            setEditor({ kind: "commitment" });
          }}
        >
          <Plus />
          Add Commitment
        </Button>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2>Savings Goals</h2>
          {state.goals.map((g) => (
            <article className="panel" key={g.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <LockKeyhole className="size-5 shrink-0 text-primary" />
                  <h3 className="truncate">{g.name}</h3>
                </div>
                <div className="flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${g.name}`}
                    onClick={() => {
                      setError("");
                      setEditor({ kind: "goal", item: g });
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${g.name}`}
                    onClick={() => setRemove({ kind: "goal", id: g.id })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <p className="small-value mt-4">
                {rupees(g.reserved)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  of {rupees(g.target)}
                </span>
              </p>
              <progress className="progress mt-3" value={g.reserved} max={g.target} />
              <p className="mt-2 text-xs text-muted-foreground">
                {rupees(g.reserved)} explicitly reserved from your budget.
              </p>
            </article>
          ))}
          {!state.goals.length && <p className="text-muted-foreground">No savings goals yet.</p>}
        </div>
        <div className="flex flex-col gap-4">
          <Commitments all />
          <div className="flex flex-col gap-1">
            {state.commitments.map((c) => (
              <div
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3"
                key={c.id}
              >
                <span className="truncate text-xs text-muted-foreground">Manage {c.name}</span>
                <div className="flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit commitment ${c.name}`}
                    disabled={state.transactions.some((t) => t.id === c.expenseId)}
                    onClick={() => {
                      setError("");
                      setEditor({ kind: "commitment", item: c });
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete commitment ${c.name}`}
                    onClick={() => setRemove({ kind: "commitment", id: c.id })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {editor && (
        <Dialog
          open
          onOpenChange={(v) => {
            if (!v) setEditor(null);
          }}
        >
          <DialogContent>
            <DialogTitle>
              {editor.item ? "Edit" : "Add"}{" "}
              {editor.kind === "goal" ? "Savings Goal" : "Commitment"}
            </DialogTitle>
            <DialogDescription>
              {editor.kind === "goal"
                ? "Only explicitly reserved funds reduce your daily allowance."
                : "Unpaid bills within this cycle are protected from daily spending."}
            </DialogDescription>
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <label className="field-label">
                Name
                <input
                  className="field"
                  name="name"
                  required
                  maxLength={120}
                  defaultValue={editor.item?.name}
                />
              </label>
              <label className="field-label">
                {editor.kind === "goal" ? "Target" : "Amount"} (₹)
                <input
                  className="field"
                  name="amount"
                  type="number"
                  min="0.01"
                  max="1000000000"
                  step="0.01"
                  required
                  defaultValue={
                    editor.item
                      ? "target" in editor.item
                        ? editor.item.target
                        : editor.item.amount
                      : undefined
                  }
                />
              </label>
              {editor.kind === "goal" ? (
                <label className="field-label">
                  Reserved from this budget (₹)
                  <input
                    className="field"
                    name="reserved"
                    type="number"
                    min="0"
                    max="1000000000"
                    step="0.01"
                    required
                    defaultValue={
                      editor.item && "reserved" in editor.item ? editor.item.reserved : 0
                    }
                  />
                </label>
              ) : (
                <label className="field-label">
                  Due Date
                  <input
                    className="field"
                    name="date"
                    type="date"
                    required
                    defaultValue={
                      editor.item && "dueDate" in editor.item ? editor.item.dueDate : localDate()
                    }
                  />
                </label>
              )}
              {error && (
                <p className="text-destructive" role="alert">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditor(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save {editor.kind === "goal" ? "Goal" : "Commitment"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {remove && (
        <ConfirmDialog
          title={remove.kind === "goal" ? "Remove savings goal?" : "Remove commitment?"}
          detail={
            remove.kind === "goal"
              ? "Reserved savings for this goal will return to your flexible cash."
              : "This removes the commitment reservation. Any recorded payment remains in your ledger."
          }
          onClose={() => setRemove(null)}
          onConfirm={() =>
            update((s) =>
              remove.kind === "goal"
                ? { ...s, goals: s.goals.filter((g) => g.id !== remove.id) }
                : { ...s, commitments: s.commitments.filter((c) => c.id !== remove.id) },
            )
          }
        />
      )}
    </>
  );
}
export function SettingsPage() {
  const { state, update, reset } = usePilot();
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const next = {
      ...state,
      budget: {
        amount: Number(d.get("budget")),
        startDate: String(d.get("start")),
        duration: Number(d.get("duration")),
      },
      caps: Object.fromEntries(categories.map((c) => [c, Number(d.get(c))])),
    };
    const parsed = stateSchema.safeParse(next);
    if (!parsed.success) {
      setMessage("Check all values. Amounts must be positive and duration must be 1–366 days.");
      return;
    }
    update(() => parsed.data);
    setMessage("Budget and category caps saved.");
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pocketpilot-ledger.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <PageHeading
        title="Your budget. Your rules."
        subtitle="Set your cycle and the spending envelopes that work for you."
      />
      <form className="flex max-w-3xl flex-col gap-6" onSubmit={submit}>
        <h2>Budget Cycle</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="field-label">
            Total Budget (₹)
            <input
              className="field bg-card"
              name="budget"
              type="number"
              min="0.01"
              max="1000000000"
              step="0.01"
              required
              defaultValue={state.budget.amount}
            />
          </label>
          <label className="field-label">
            Start Date
            <input
              className="field bg-card"
              name="start"
              type="date"
              required
              defaultValue={state.budget.startDate}
            />
          </label>
          <label className="field-label">
            Duration (days)
            <input
              className="field bg-card"
              name="duration"
              type="number"
              min="1"
              max="366"
              required
              defaultValue={state.budget.duration}
            />
          </label>
        </div>
        <h2>Category Caps</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <label className="field-label" key={c}>
              {c} (₹)
              <input
                className="field bg-card"
                name={c}
                type="number"
                min="0.01"
                max="1000000000"
                step="0.01"
                required
                defaultValue={state.caps[c]}
              />
            </label>
          ))}
        </div>
        <Button type="submit" className="self-start">
          <Check />
          Save Settings
        </Button>
        {message && (
          <p role="status" className="text-primary">
            {message}
          </p>
        )}
      </form>
      <div className="mt-2 border-t pt-6">
        <h2>Your Data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Saved on this device. Your ledger never leaves your browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            <Download />
            Export Ledger
          </Button>
          <Button variant="ghost" className="text-destructive" onClick={() => setConfirm(true)}>
            Reset Demo Ledger
          </Button>
        </div>
      </div>
      {confirm && (
        <ConfirmDialog
          title="Restore the example ledger?"
          detail="All current records and settings will be replaced with the original example."
          onClose={() => setConfirm(false)}
          onConfirm={reset}
        />
      )}
    </>
  );
}
