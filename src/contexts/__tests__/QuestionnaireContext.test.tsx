import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuestionnaireProvider, useQuestionnaire } from "../QuestionnaireContext";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const ActivityDisplay = () => {
  const { lastActivity } = useQuestionnaire();
  return <div data-testid="last-activity">{lastActivity}</div>;
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe("QuestionnaireProvider", () => {
  it("updates lastActivity when global activity events are fired", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    render(
      <QuestionnaireProvider totalSteps={1}>
        <ActivityDisplay />
      </QuestionnaireProvider>,
    );

    const getLastActivity = () => Number(screen.getByTestId("last-activity").textContent);
    const initialActivity = getLastActivity();

    vi.setSystemTime(new Date("2024-01-01T00:00:01Z"));
    fireEvent.mouseMove(window);

    expect(getLastActivity()).toBe(Date.now());
    expect(getLastActivity()).toBeGreaterThan(initialActivity);
  });

  it("refreshes activity timestamps to avoid questionnaire reset after user interactions", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    localStorage.setItem("anamnesis_data", "{\"persist\":true}");

    render(
      <QuestionnaireProvider totalSteps={1}>
        <ActivityDisplay />
      </QuestionnaireProvider>,
    );

    vi.setSystemTime(100000);
    fireEvent.scroll(window);

    vi.setSystemTime(310000);
    vi.advanceTimersByTime(10000);

    expect(localStorage.getItem("anamnesis_data")).toBe("{\"persist\":true}");
  });
});
