import { createContext, useContext } from "react";
import type { calculate, PilotState, Transaction } from "./finance";

export type PilotStore = {
  state: PilotState;
  metrics: ReturnType<typeof calculate>;
  update: (fn: (state: PilotState) => PilotState) => void;
  saveExpense: (expense: Transaction) => void;
  deleteExpense: (id: string) => void;
  reset: () => void;
  storageError: string;
  ready: boolean;
};

// Keep context identity outside the component refresh boundary. Refreshing the
// provider must not leave mounted consumers reading a newly created context.
export const PilotContext = createContext<PilotStore | null>(null);

export function usePilot() {
  const value = useContext(PilotContext);
  if (!value) throw new Error("PocketPilot provider missing");
  return value;
}