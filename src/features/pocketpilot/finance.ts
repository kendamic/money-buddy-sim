import { z } from "zod";
export const categories = ["Food & Snacks", "Travel", "Fun & Outings", "Everything Else"] as const;
export type Category = (typeof categories)[number];
const validDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => Number.isFinite(Date.parse(v)));
const amount = z.number().finite().positive().max(1e9);
export const transactionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  amount,
  category: z.enum(categories),
  date: validDate,
});
export type Transaction = z.infer<typeof transactionSchema>;
const commitmentSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  amount,
  dueDate: validDate,
  expenseId: z.string().optional(),
});
export type Commitment = z.infer<typeof commitmentSchema>;
const goalSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  target: amount,
  reserved: z.number().finite().min(0).max(1e9),
});
export type Goal = z.infer<typeof goalSchema>;
export const stateSchema = z.object({
  version: z.literal(1),
  budget: z.object({ amount, startDate: validDate, duration: z.number().int().min(1).max(366) }),
  transactions: z.array(transactionSchema),
  commitments: z.array(commitmentSchema),
  goals: z.array(goalSchema),
  caps: z.record(z.enum(categories), amount),
  radarSnoozedUntil: z.string().optional(),
});
export type PilotState = z.infer<typeof stateSchema>;
export const rupees = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localDate(d);
}
export function demoState(today = localDate()): PilotState {
  const start = addDays(today, -11);
  return {
    version: 1,
    budget: { amount: 10000, duration: 30, startDate: start },
    transactions: [
      { id: "1", title: "Blue Tokai Coffee", category: "Food & Snacks", amount: 240, date: today },
      {
        id: "2",
        title: "Metro Card Recharge",
        category: "Travel",
        amount: 200,
        date: addDays(today, -1),
      },
      {
        id: "3",
        title: "Zomato Biryani",
        category: "Food & Snacks",
        amount: 480,
        date: addDays(today, -2),
      },
      {
        id: "4",
        title: "Blinkit Groceries",
        category: "Food & Snacks",
        amount: 400,
        date: addDays(today, -3),
      },
      {
        id: "5",
        title: "Steam Game Sale",
        category: "Fun & Outings",
        amount: 680,
        date: addDays(today, -5),
      },
      { id: "6", title: "Uber Commute", category: "Travel", amount: 250, date: addDays(today, -7) },
      {
        id: "7",
        title: "Stationery & Notebooks",
        category: "Everything Else",
        amount: 330,
        date: addDays(today, -9),
      },
    ],
    commitments: [
      { id: "c1", name: "Airtel Broadband Fiber", amount: 799, dueDate: addDays(start, 17) },
      { id: "c2", name: "Spotify Student Duo", amount: 119, dueDate: addDays(start, 21) },
    ],
    goals: [{ id: "g1", name: "Savings Vault", target: 2000, reserved: 2000 }],
    caps: { "Food & Snacks": 3000, Travel: 1000, "Fun & Outings": 2000, "Everything Else": 2000 },
  };
}
export function calculate(state: PilotState, today = localDate(), hypothetical = 0) {
  const endDate = addDays(state.budget.startDate, state.budget.duration - 1);
  const elapsed =
    Math.floor((Date.parse(today) - Date.parse(state.budget.startDate)) / 86400000) + 1;
  const day = Math.max(0, Math.min(state.budget.duration, elapsed));
  const remainingDays = Math.max(
    0,
    Math.min(state.budget.duration, state.budget.duration - elapsed),
  );
  const records = state.transactions.filter(
    (t) => t.date >= state.budget.startDate && t.date <= endDate,
  );
  const spent = records.reduce((s, t) => s + t.amount, 0);
  const remaining = state.budget.amount - spent;
  const unpaid = state.commitments
    .filter(
      (c) =>
        !records.some((t) => t.id === c.expenseId) &&
        c.dueDate >= state.budget.startDate &&
        c.dueDate <= endDate,
    )
    .reduce((s, c) => s + c.amount, 0);
  const reserved = state.goals.reduce((s, g) => s + g.reserved, 0);
  const flexible = Math.max(0, remaining - unpaid - reserved - hypothetical);
  const safe = remainingDays > 0 ? flexible / remainingDays : 0;
  const pace = day > 0 ? spent / day : 0;
  const forecast = pace * state.budget.duration;
  const totals = Object.fromEntries(
    categories.map((c) => [
      c,
      records.filter((t) => t.category === c).reduce((s, t) => s + t.amount, 0),
    ]),
  ) as Record<Category, number>;
  return {
    spent,
    remaining,
    unpaid,
    reserved,
    flexible,
    safe,
    day,
    remainingDays,
    endDate,
    pace,
    forecast,
    surplus: state.budget.amount - forecast,
    burn: (spent / state.budget.amount) * 100,
    totals,
    records,
  };
}
export type Insight = { id: string; title: string; detail: string };
export function insights(state: PilotState): Insight[] {
  const m = calculate(state);
  if (!m.records.length) return [];
  const top = categories.reduce((a, b) => (m.totals[a] >= m.totals[b] ? a : b));
  const small = m.records.filter((t) => t.amount <= 250);
  const large = m.records.reduce((a, b) => (a.amount >= b.amount ? a : b));
  const result: Insight[] = [
    {
      id: "top",
      title: `${top} leads your spending`,
      detail: `${m.records.filter((t) => t.category === top).length} charges totaling ${rupees(m.totals[top])}. That's ${((m.totals[top] / m.spent) * 100).toFixed(0)}% of recorded spending.`,
    },
    {
      id: "pace",
      title:
        m.forecast <= state.budget.amount ? "On a steady pace" : "Your pace is above your budget",
      detail: `At ${rupees(m.pace)} per day, your cycle-end forecast is ${rupees(m.forecast)} against a ${rupees(state.budget.amount)} budget.`,
    },
  ];
  if (small.length >= 3)
    result.push({
      id: "small",
      title: "Small purchases add up",
      detail: `${small.length} purchases of ₹250 or less add up to ${rupees(small.reduce((s, t) => s + t.amount, 0))}.`,
    });
  if (large && large.amount >= (m.spent / m.records.length) * 2)
    result.push({
      id: "large",
      title: "Your largest purchase stands out",
      detail: `${large.title} at ${rupees(large.amount)} is ${(large.amount / (m.spent / m.records.length)).toFixed(1)} times your average purchase.`,
    });
  return result;
}
