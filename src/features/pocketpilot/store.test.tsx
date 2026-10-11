import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PilotProvider } from "./store";
import { usePilot } from "./context";
import { localDate } from "./finance";

function Consumer() {
  const { metrics, saveExpense, ready } = usePilot();
  return <><output aria-label="Balance">{metrics.remaining}</output><button disabled={!ready} onClick={() => saveExpense({ id: "provider-test", title: "Test expense", amount: 100, category: "Travel", date: localDate() })}>Record</button></>;
}

afterEach(() => { cleanup(); localStorage.clear(); });

describe("PocketPilot provider and consumers", () => {
  it("shares state with mounted consumers through provider rerenders", async () => {
    const view = render(<PilotProvider><Consumer /></PilotProvider>);
    await waitFor(() => expect(screen.getByText("Record")).toBeEnabled());
    fireEvent.click(screen.getByText("Record"));
    expect(screen.getByLabelText("Balance")).toHaveTextContent("7320");
    view.rerender(<PilotProvider><Consumer /></PilotProvider>);
    expect(screen.getByLabelText("Balance")).toHaveTextContent("7320");
  });

  it("restores persisted records after remount without losing its context", async () => {
    const view = render(<PilotProvider><Consumer /></PilotProvider>);
    await waitFor(() => expect(screen.getByText("Record")).toBeEnabled());
    fireEvent.click(screen.getByText("Record"));
    view.unmount();
    await act(async () => { render(<PilotProvider><Consumer /></PilotProvider>); });
    await waitFor(() => expect(screen.getByLabelText("Balance")).toHaveTextContent("7320"));
  });
});