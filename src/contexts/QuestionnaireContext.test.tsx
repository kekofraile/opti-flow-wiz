import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuestionnaireProvider, useQuestionnaire } from './QuestionnaireContext';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const STORAGE_KEY = 'anamnesis_data';

const TestComponent = () => {
  const { data } = useQuestionnaire();
  return <div data-testid="questionnaire-data">{JSON.stringify(data)}</div>;
};

describe('QuestionnaireProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('handles invalid stored data by resetting the questionnaire', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid-json');

    render(
      <QuestionnaireProvider totalSteps={5}>
        <TestComponent />
      </QuestionnaireProvider>,
    );

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{}');
    });

    expect(screen.getByTestId('questionnaire-data').textContent).toBe('{}');
    expect((toast as unknown as { info: ReturnType<typeof vi.fn> }).info).toHaveBeenCalled();
  });
});
