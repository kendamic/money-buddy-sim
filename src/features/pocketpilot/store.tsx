import { useEffect, useState, type ReactNode } from "react";
import { calculate, demoState, stateSchema, type PilotState, type Transaction } from "./finance";
import { PilotContext } from "./context";
const KEY = "pocketpilot-v1";
export function PilotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PilotState>(() => demoState());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = stateSchema.safeParse(JSON.parse(raw));
        if (parsed.success) setState(parsed.data);
        else setStorageError("Saved data could not be read. The example ledger has been restored.");
      }
    } catch {
      setStorageError("Saved data is unavailable. The example ledger has been restored.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      setStorageError("This browser cannot save changes. Your data will not survive a refresh.");
    }
  }, [state, ready]);
  function saveExpense(t: Transaction) {
    setState((s) => ({
      ...s,
      transactions: s.transactions.some((x) => x.id === t.id)
        ? s.transactions.map((x) => (x.id === t.id ? t : x))
        : [t, ...s.transactions],
    }));
  }
  function deleteExpense(id: string) {
    setState((s) => ({
      ...s,
      transactions: s.transactions.filter((t) => t.id !== id),
      commitments: s.commitments.map((c) =>
        c.expenseId === id ? { ...c, expenseId: undefined } : c,
      ),
    }));
  }
  return (
    <PilotContext.Provider
      value={{
        state,
        metrics: calculate(state),
        update: setState,
        saveExpense,
        deleteExpense,
        reset: () => setState(demoState()),
        storageError,
        ready,
      }}
    >
      {children}
    </PilotContext.Provider>
  );
}
