import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'vibe_prompt_onboarding';

interface OnboardingState {
  hasSeenEditorTooltip: boolean;
  hasSeenSaveTooltip: boolean;
}

const defaultState: OnboardingState = {
  hasSeenEditorTooltip: false,
  hasSeenSaveTooltip: false,
};

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  });

  const saveState = (newState: OnboardingState) => {
    setState(newState);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // Ignore write errors to localStorage
    }
  };

  const markEditorTooltipSeen = () => {
    if (!state.hasSeenEditorTooltip) {
      saveState({ ...state, hasSeenEditorTooltip: true });
    }
  };

  const markSaveTooltipSeen = () => {
    if (!state.hasSeenSaveTooltip) {
      saveState({ ...state, hasSeenSaveTooltip: true });
    }
  };

  const resetOnboarding = () => {
    saveState(defaultState);
  };

  return {
    ...state,
    markEditorTooltipSeen,
    markSaveTooltipSeen,
    resetOnboarding
  };
};
