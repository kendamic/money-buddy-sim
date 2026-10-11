import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Coffee,
  TrainFront,
  Gamepad2,
  ShoppingBag,
  Pencil,
  Trash2,
  LockKeyhole,
  Wifi,
  Music2,
  Check,
  Radar,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Leaf,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { categories, calculate, insights, localDate, rupees, type Category } from "./finance";
import { usePilot } from "./context";
import { dateLabel, useExpenseAction } from "./shell";
import { ConfirmDialog } from "./controls";
const icons = {
  "Food & Snacks": Coffee,
  Travel: TrainFront,
  "Fun & Outings": Gamepad2,
  "Everything Else": ShoppingBag,
};
export function Stats() {
  const { state, metrics: m } = usePilot();
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <article className="panel flex flex-col justify-between lg:col-span-7">
        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <span className="eyebrow">Cycle Liquidity</span>
            <span className="badge">
              <span className="size-1.5 rounded-full bg-primary" />
              {m.burn > (m.day / state.budget.duration) * 100
                ? "Watch Your Pace"
                : "On Steady Pace"}
            </span>
          </div>
          <div className="my-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="metric-value" data-testid="remaining-balance">
              {rupees(m.remaining)}
            </span>
            <span className="text-muted-foreground">
              remaining of {rupees(state.budget.amount)} budget
            </span>
          </div>
          <progress className="progress h-3" value={Math.min(m.burn, 100)} max={100} />
        </div>
        <div className="soft-block mt-6 grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Starting Allotment</p>
            <p className="small-value">{rupees(state.budget.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Consumed to Date</p>
            <p className="small-value" data-testid="total-spent">
              {rupees(m.spent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cycle Burn</p>
            <p className="small-value text-primary">{m.burn.toFixed(1)}%</p>
          </div>
        </div>
      </article>
      <article className="panel panel-soft flex flex-col justify-between lg:col-span-5">
        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <span className="eyebrow">Safe Daily Allowance</span>
            <span className="badge">{m.remainingDays} Days Left</span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="metric-value">{rupees(Math.floor(m.safe))}</span>
            <span className="font-semibold text-secondary">/ day</span>
          </div>
          <p className="text-muted-foreground">
            Guaranteed safe rate while protecting all recurring liabilities and your locked
            baseline.
          </p>
        </div>
        <dl className="mt-4 rounded-xl bg-card p-4 text-xs">
          <div className="flex justify-between gap-2 py-1">
            <dt className="text-muted-foreground">Total Remaining</dt>
            <dd className="font-semibold">{rupees(m.remaining)}</dd>
          </div>
          <div className="flex justify-between gap-2 py-1">
            <dt className="flex items-center gap-1 text-muted-foreground">
              Unpaid Commitments <LockKeyhole className="size-3" />
            </dt>
            <dd className="font-semibold text-tertiary">− {rupees(m.unpaid)}</dd>
          </div>
          <div className="flex justify-between gap-2 py-1">
            <dt className="text-muted-foreground">Reserved Savings</dt>
            <dd className="font-semibold text-tertiary">− {rupees(m.reserved)}</dd>
          </div>
          <div className="flex justify-between gap-2 py-1">
            <dt className="text-muted-foreground">Net Flexible Cash</dt>
            <dd className="font-bold">{rupees(m.flexible)}</dd>
          </div>
          <div className="mt-2 rounded-lg bg-surface-container px-2 py-1.5 text-muted-foreground">
            Formula:{" "}
            <span className="font-mono text-foreground">
              (Remaining − Commitments − Savings) ÷ {m.remainingDays}d
            </span>
          </div>
        </dl>
      </article>
    </div>
  );
}
export function RadarBanner() {
  const { state, update } = usePilot();
  const [open, setOpen] = useState(false);
  const list = insights(state);
  const item = list[0];
  if (!item || (state.radarSnoozedUntil && Date.parse(state.radarSnoozedUntil) > Date.now()))
    return null;
  return (
    <>
      <div className="flex flex-col justify-between gap-4 rounded-xl bg-surface-high p-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <Radar className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-secondary">Pattern Radar Telemetry</span>
              <span className="text-xs text-muted-foreground">• Spending Behaviour</span>
            </div>
            <p className="mt-1 font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              update((s) => ({
                ...s,
                radarSnoozedUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
              }))
            }
          >
            Remind Next Week
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            Inspect Pattern
            <ArrowRight />
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Spending Telemetry</DialogTitle>
          <DialogDescription>Patterns from your recorded cycle expenses.</DialogDescription>
          {list.map((i) => (
            <div key={i.id} className="soft-block">
              <p className="font-semibold">{i.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{i.detail}</p>
            </div>
          ))}
          <Button onClick={() => setOpen(false)}>Understood & Logged</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Forecast() {
  const { state, metrics: m } = usePilot();
  const data = useMemo(
    () =>
      Array.from({ length: state.budget.duration + 1 }, (_, i) => {
        const cumulative = m.records
          .filter(
            (t) =>
              Math.floor((Date.parse(t.date) - Date.parse(state.budget.startDate)) / 86400000) +
                1 <=
              i,
          )
          .reduce((s, t) => s + t.amount, 0);
        return {
          day: i,
          actual: i <= m.day ? cumulative : null,
          forecast: i >= m.day ? m.spent + m.pace * (i - m.day) : null,
        };
      }),
    [state, m.day, m.spent, m.pace],
  );
  return (
    <article className="panel flex flex-col justify-between">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Burn Pace & Outlook</p>
          <h3>30-Day Spend Forecast</h3>
        </div>
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span>— Actual</span>
          <span>┄ Forecast</span>
          <span>┄ Target Ceiling</span>
        </div>
      </div>
      <div
        className="my-4 h-48 w-full min-w-0"
        role="img"
        aria-label={`Actual spending ${rupees(m.spent)}, forecast ${rupees(m.forecast)}, budget limit ${rupees(state.budget.amount)}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 14, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--surface-high)" />
            <XAxis
              dataKey="day"
              ticks={[0, m.day, state.budget.duration]}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `Day ${v}`}
            />
            <YAxis hide domain={[0, Math.max(state.budget.amount, m.forecast) * 1.1]} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="chart-tip">
                    <p className="text-xs">Day {label}</p>
                    {payload
                      .filter((p) => p.value != null)
                      .map((p) => (
                        <p key={p.dataKey} className="font-semibold">
                          {p.name}: {rupees(Number(p.value))}
                        </p>
                      ))}
                  </div>
                ) : null
              }
            />
            <ReferenceLine y={state.budget.amount} stroke="var(--border)" strokeDasharray="4 4" />
            <ReferenceLine x={m.day} stroke="var(--primary)" strokeOpacity={0.3} />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="actual"
              name="Actual"
              fill="var(--primary-container)"
              fillOpacity={0.25}
              stroke="var(--primary)"
              strokeWidth={3}
            />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="var(--secondary)"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="soft-block grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Observed Average Pace</p>
          <p className="small-value">
            {rupees(m.pace)}
            <span className="text-xs font-normal text-muted-foreground">/day</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Est. Month-End Total</p>
          <p className="small-value">{rupees(m.forecast)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Projected Cycle Surplus</p>
          <p className="small-value text-primary">
            {m.surplus >= 0 ? "+ " : ""}
            {rupees(m.surplus)}
          </p>
        </div>
      </div>
    </article>
  );
}
export function CategoryBurn() {
  const { state, metrics: m } = usePilot();
  return (
    <article className="panel flex flex-col justify-between">
      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div>
            <p className="eyebrow">Discretionary Envelopes</p>
            <h3>Category Burn</h3>
          </div>
          <Button asChild size="sm" variant="link">
            <Link to="/settings">Adjust Caps</Link>
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {categories.map((c, i) => {
            const Icon = icons[c];
            const cap = state.caps[c] ?? 1;
            const rate = (m.totals[c] / cap) * 100;
            return (
              <div key={c}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0 text-secondary" />
                    <span className="truncate text-xs font-semibold">{c}</span>
                  </div>
                  <span className="text-xs font-semibold">
                    {rupees(m.totals[c])}{" "}
                    <span className="font-normal text-muted-foreground">/ {rupees(cap)}</span>
                  </span>
                </div>
                <progress
                  className={`progress mt-2 ${["", "category-travel", "category-fun", "category-other"][i]}`}
                  value={Math.min(rate, 100)}
                  max={100}
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>{rate.toFixed(0)}% consumed</span>
                  <span className={rate >= 85 ? "text-tertiary" : "text-primary"}>
                    {rate >= 100 ? "Exceeded" : rate >= 85 ? "Caution" : "Safe"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-surface-low p-3">
        <ShieldCheck className="size-5 shrink-0 text-secondary" />
        <span className="text-xs text-muted-foreground">
          Savings Vault is hard-locked at {rupees(m.reserved)}
        </span>
        <span className="badge ml-auto hidden xl:inline-flex">Untouchable</span>
      </div>
    </article>
  );
}
export function Commitments({ all = false }: { all?: boolean }) {
  const { state, metrics: m, update } = usePilot();
  return (
    <article className="panel flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">Pre-allocated Cash</span>
          <span className="badge bg-tertiary-container text-tertiary">
            {
              state.commitments.filter((c) => !state.transactions.some((t) => t.id === c.expenseId))
                .length
            }{" "}
            Due Soon
          </span>
        </div>
        <h3 className="mt-1">Upcoming Commitments</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          These funds are walled off from your daily allowance until confirmed paid.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {state.commitments.slice(0, all ? undefined : 3).map((c, i) => {
            const paid = state.transactions.some((t) => t.id === c.expenseId);
            const Icon = i % 2 === 0 ? Wifi : Music2;
            return (
              <div key={c.id} className="rounded-lg bg-surface-low p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0 text-secondary" />
                    <span className="truncate text-xs font-semibold" title={c.name}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold">{rupees(c.amount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Due {dateLabel(c.dueDate)}
                  </span>
                  <Button
                    size="sm"
                    variant={paid ? "ghost" : "outline"}
                    aria-label={`${paid ? "Undo payment for" : "Mark paid"} ${c.name}`}
                    onClick={() => {
                      const id = crypto.randomUUID();
                      update((s) => {
                        const exists = s.transactions.some((t) => t.id === c.expenseId);
                        return {
                          ...s,
                          transactions: exists
                            ? s.transactions.filter((t) => t.id !== c.expenseId)
                            : [
                                {
                                  id,
                                  title: c.name,
                                  amount: c.amount,
                                  category: "Everything Else",
                                  date: localDate(),
                                },
                                ...s.transactions,
                              ],
                          commitments: s.commitments.map((x) =>
                            x.id === c.id ? { ...x, expenseId: exists ? undefined : id } : x,
                          ),
                        };
                      });
                    }}
                  >
                    {paid ? (
                      <>
                        <Check />
                        Paid
                      </>
                    ) : (
                      "Mark Paid"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
          {!state.commitments.length && (
            <p className="text-sm text-muted-foreground">
              No commitments. A little more breathing room.
            </p>
          )}
        </div>
      </div>
      <div className="soft-block mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Total Quarantined</span>
          <span className="font-semibold">{rupees(m.unpaid)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Settling a bill records its expense and removes its reservation.
        </p>
      </div>
    </article>
  );
}
export function ExpenseList({
  all = false,
  search = "",
  category = "All",
  from = "",
  to = "",
}: {
  all?: boolean;
  search?: string;
  category?: string;
  from?: string;
  to?: string;
}) {
  const { state, deleteExpense, reset } = usePilot();
  const edit = useExpenseAction();
  const [confirm, setConfirm] = useState<string | null>(null);
  const rows = state.transactions
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || t.category === category) &&
        (!from || t.date >= from) &&
        (!to || t.date <= to),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <article className="panel flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Live Ledger</span>
            <span className="text-xs text-muted-foreground">{rows.length} entries</span>
          </div>
          <h3 className="mt-1">{all ? "Transaction History" : "Recent Expenses"}</h3>
          <div className="mt-4 flex flex-col gap-1">
            {rows.slice(0, all ? undefined : 5).map((t) => {
              const Icon = icons[t.category];
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-1 py-2.5 hover:bg-surface-low"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-low text-secondary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold" title={t.title}>
                        {t.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {dateLabel(t.date)} • {t.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <span className="mr-1 text-xs font-bold">{rupees(t.amount)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      title={`Edit ${t.title}`}
                      aria-label={`Edit ${t.title}`}
                      onClick={() => edit(t)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-destructive"
                      title={`Delete ${t.title}`}
                      aria-label={`Delete ${t.title}`}
                      onClick={() => setConfirm(t.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {!rows.length && (
              <p className="py-5 text-sm text-muted-foreground">
                No expenses found. A fresh page in your ledger.
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            {all
              ? `${rupees(rows.reduce((s, t) => s + t.amount, 0))} in this view`
              : "Your ledger, up to date."}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => setConfirm("reset")}
          >
            Reset Demo Ledger
          </Button>
        </div>
      </article>
      {confirm && (
        <ConfirmDialog
          title={confirm === "reset" ? "Restore the example ledger?" : "Delete this expense?"}
          detail={
            confirm === "reset"
              ? "This replaces all expenses, commitments, goals, and budget settings with the original example."
              : "This expense will be removed. Your balance and daily allowance will be recalculated."
          }
          onClose={() => setConfirm(null)}
          onConfirm={() => (confirm === "reset" ? reset() : deleteExpense(confirm))}
        />
      )}
    </>
  );
}
export function VibeCard({ expanded = false }: { expanded?: boolean }) {
  const { state, metrics: m, saveExpense } = usePilot();
  const [amount, setAmount] = useState("1200");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Fun & Outings");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const purchaseLock = useRef(false);
  const after = result === null ? null : calculate(state, localDate(), result);
  return (
    <article
      className={`panel panel-dark flex flex-col justify-between ${expanded ? "max-w-2xl" : ""}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-5 text-primary-container" />
          <span className="eyebrow text-primary-container">Vibe Check</span>
        </div>
        <h3 className="mt-3 font-bold">Can I afford this impulse?</h3>
        <p className="mt-2 text-xs text-inverse-foreground/80">
          Simulate sneakers, gig tickets, or coffee runs before swiping. See the exact impact on
          your daily allowance instantly.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 rounded-xl bg-inverse-foreground/10 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            const a = Number(amount);
            if (!Number.isFinite(a) || a <= 0 || a > 1e9) {
              setError("Enter an amount greater than zero.");
              return;
            }
            setError("");
            setResult(a);
            setApplied(false);
            purchaseLock.current = false;
          }}
        >
          {expanded && (
            <>
              <label className="field-label text-inverse-foreground">
                Purchase name
                <input
                  className="field"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g. New sneakers"
                  maxLength={120}
                />
              </label>
              <label className="field-label text-inverse-foreground">
                Category
                <select
                  className="field"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category);
                    setResult(null);
                  }}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label
            className="eyebrow text-inverse-foreground/70"
            htmlFor={expanded ? "vibe-full" : "vibe-quick"}
          >
            Simulation Amount (₹)
          </label>
          <div className="flex items-center gap-2">
            <span className="currency text-[28px] font-extrabold">₹</span>
            <input
              id={expanded ? "vibe-full" : "vibe-quick"}
              aria-label="Simulation Amount (₹)"
              className="w-full min-w-0 bg-transparent font-heading text-[22px] font-bold focus:outline-none"
              type="number"
              min="0.01"
              max="1000000000"
              step="0.01"
              required
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setResult(null);
                setApplied(false);
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            Compute Impact
          </Button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-tertiary-container">
            {error}
          </p>
        )}
        {after && result !== null && (
          <div className="mt-3 rounded-lg bg-inverse-foreground/10 p-3">
            <p className="eyebrow text-primary-container">Hypothetical · not recorded</p>
            <p className="mt-2 text-sm">
              Balance after purchase: <strong>{rupees(m.remaining - result)}</strong>
            </p>
            <p className="mt-1 text-sm">
              Daily allowance: <strong>{rupees(Math.floor(after.safe))}</strong>{" "}
              <span className="text-xs text-inverse-foreground/70">
                (was {rupees(Math.floor(m.safe))})
              </span>
            </p>
            <p className="mt-2 text-xs text-inverse-foreground/80">
              {result > m.flexible
                ? "This goes beyond your flexible cash. Your commitments and savings would be at risk."
                : "This fits within your flexible cash. Your protected funds stay untouched."}
            </p>
            {expanded ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  disabled={applied}
                  onClick={() => {
                    if (applied || purchaseLock.current) return;
                    purchaseLock.current = true;
                    setApplied(true);
                    saveExpense({
                      id: crypto.randomUUID(),
                      title: title.trim() || "Vibe Check purchase",
                      amount: result,
                      category,
                      date: localDate(),
                    });
                    setResult(null);
                  }}
                >
                  <Check />
                  Record Purchase
                </Button>
                <Button variant="ghost" onClick={() => setResult(null)}>
                  Cancel Simulation
                </Button>
              </div>
            ) : (
              <Button asChild className="mt-3 w-full">
                <Link to="/vibe-check">
                  Review Purchase
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        )}
        {applied && (
          <p role="status" className="mt-3 text-primary-container">
            Purchase recorded once in your ledger.
          </p>
        )}
      </div>
      <div className="mt-5 flex justify-between text-xs text-inverse-foreground/70">
        <span>Zero guilt calculations.</span>
        <Leaf className="size-4" />
      </div>
    </article>
  );
}
